const m="instance_types",d="instance_type_pricing",y=`
  CREATE TABLE IF NOT EXISTS ${m} (
    id SERIAL PRIMARY KEY,
    iaas TEXT NOT NULL,
    name TEXT NOT NULL,
    cpu REAL NOT NULL,
    ram REAL NOT NULL,
    ephemeral_disk REAL NOT NULL,
    cost_on_demand REAL,
    cost_1_year_term REAL,
    cost_3_year_term REAL
  );
`,L=`
  CREATE TABLE IF NOT EXISTS ${d} (
    iaas TEXT NOT NULL,
    region TEXT NOT NULL,
    name TEXT NOT NULL,
    cost_on_demand REAL,
    cost_1_year_term REAL,
    cost_3_year_term REAL,
    cost_updated_at TEXT,
    PRIMARY KEY (iaas, region, name)
  );
`,N=`SELECT count(*)::int as n FROM ${m}`,A=`
  INSERT INTO ${m} (iaas, name, cpu, ram, ephemeral_disk, cost_on_demand, cost_1_year_term, cost_3_year_term)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
`,E=`
  INSERT INTO ${d} (iaas, region, name, cost_on_demand, cost_1_year_term, cost_3_year_term, cost_updated_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  ON CONFLICT (iaas, region, name) DO UPDATE SET
    cost_on_demand = EXCLUDED.cost_on_demand,
    cost_1_year_term = EXCLUDED.cost_1_year_term,
    cost_3_year_term = EXCLUDED.cost_3_year_term,
    cost_updated_at = EXCLUDED.cost_updated_at
`,O=`
  UPDATE ${m}
  SET cost_on_demand = COALESCE($3, cost_on_demand),
      cost_1_year_term = COALESCE($4, cost_1_year_term),
      cost_3_year_term = COALESCE($5, cost_3_year_term),
      cost_updated_at = $6
  WHERE iaas = $1 AND name = $2
`,I=["us-east-1","us-east-2","us-west-1","us-west-2","ca-central-1","ca-west-1"],S=["eastus","eastus2","canadacentral","canadaeast"];async function f(){return await $fetch("/data/instance_types.json")}async function p(){return await $fetch("/data/azure_instance_types_eastus.json")}async function R(t){return await $fetch(`/data/azure_instance_types_${t}.json`)}async function $(t){return await $fetch(`/data/aws_instance_types_${t}.json`)}async function D(t,c){await t.exec(y),await t.exec(L);const s=(await t.query(N)).rows?.[0]?.n??0;let n,e=null;if(s===0){n=await f();try{e=await p()}catch{}const i={...n,...e?.instanceTypes?.length?{azure:e.instanceTypes}:{}};for(const[r,o]of Object.entries(i))if(Array.isArray(o))for(const a of o){const l=a.cost??null;await t.query(A,[r,a.name,a.cpu,a.ram,a.ephemeralDisk,l?.["On-Demand"]??null,l?.["1-Year Term"]??null,l?.["3-Year Term"]??null])}}const u=new Date().toISOString();for(const i of S)try{const r=await R(i);if(!r?.instanceTypes?.length)continue;for(const o of r.instanceTypes){const a=o.cost??null;await t.query(E,["azure",r.region,o.name,a?.["On-Demand"]??null,a?.["1-Year Term"]??null,a?.["3-Year Term"]??null,u])}}catch{}await t.exec(`
    INSERT INTO ${d} (iaas, region, name, cost_on_demand, cost_1_year_term, cost_3_year_term, cost_updated_at)
    SELECT 'azure', 'eastus', name, cost_on_demand, cost_1_year_term, cost_3_year_term, NULL
    FROM ${m}
    WHERE iaas = 'azure' AND (cost_on_demand IS NOT NULL OR cost_1_year_term IS NOT NULL OR cost_3_year_term IS NOT NULL)
    ON CONFLICT (iaas, region, name) DO NOTHING
  `);const T=new Date().toISOString();for(const i of I)try{const r=await $(i);if(!r?.instanceTypes?.length)continue;for(const o of r.instanceTypes){const a=o.cost??null;await t.query(E,["aws",r.region,o.name,a?.["On-Demand"]??null,a?.["1-Year Term"]??null,a?.["3-Year Term"]??null,T])}}catch{}}async function w(t,c,_,s){if(!s)return;const n=s["On-Demand"]??null,e=s["1-Year Term"]??null,u=s["3-Year Term"]??null;if(n==null&&e==null&&u==null)return;const T=new Date().toISOString();await t.query(O,[c,_,n,e,u,T])}async function C(t,c,_,s,n){if(!n)return;const e=n["On-Demand"]??null,u=n["1-Year Term"]??null,T=n["3-Year Term"]??null;if(e==null&&u==null&&T==null)return;const i=new Date().toISOString();await t.query(E,[c,_.trim(),s,e,u,T,i])}async function U(t,c,_){let s=0;if(_?.trim())for(const[n,e]of Object.entries(c))!e||e["On-Demand"]==null&&e["1-Year Term"]==null&&e["3-Year Term"]==null||(await C(t,"azure",_.trim(),n,e),s+=1);else for(const[n,e]of Object.entries(c))!e||e["On-Demand"]==null&&e["1-Year Term"]==null&&e["3-Year Term"]==null||(await w(t,"azure",n,e),s+=1);return s}export{I as A,U as a,D as s,C as u};
