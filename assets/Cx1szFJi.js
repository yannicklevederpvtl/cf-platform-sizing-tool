const T="instance_types",m="instance_type_pricing",L=`
  CREATE TABLE IF NOT EXISTS ${T} (
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
`,N=`
  CREATE TABLE IF NOT EXISTS ${m} (
    iaas TEXT NOT NULL,
    region TEXT NOT NULL,
    name TEXT NOT NULL,
    cost_on_demand REAL,
    cost_1_year_term REAL,
    cost_3_year_term REAL,
    cost_updated_at TEXT,
    PRIMARY KEY (iaas, region, name)
  );
`,y=`SELECT count(*)::int as n FROM ${T}`,O=`
  INSERT INTO ${T} (iaas, name, cpu, ram, ephemeral_disk, cost_on_demand, cost_1_year_term, cost_3_year_term)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
`,I=`
  INSERT INTO ${m} (iaas, region, name, cost_on_demand, cost_1_year_term, cost_3_year_term, cost_updated_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  ON CONFLICT (iaas, region, name) DO NOTHING
`,d=`
  INSERT INTO ${m} (iaas, region, name, cost_on_demand, cost_1_year_term, cost_3_year_term, cost_updated_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  ON CONFLICT (iaas, region, name) DO UPDATE SET
    cost_on_demand = EXCLUDED.cost_on_demand,
    cost_1_year_term = EXCLUDED.cost_1_year_term,
    cost_3_year_term = EXCLUDED.cost_3_year_term,
    cost_updated_at = EXCLUDED.cost_updated_at
`,S=`
  UPDATE ${T}
  SET cost_on_demand = COALESCE($3, cost_on_demand),
      cost_1_year_term = COALESCE($4, cost_1_year_term),
      cost_3_year_term = COALESCE($5, cost_3_year_term),
      cost_updated_at = $6
  WHERE iaas = $1 AND name = $2
`,A=["us-east-1","us-east-2","us-west-1","us-west-2","ca-central-1","ca-west-1"];async function p(){return await $fetch("/data/instance_types.json")}async function E(){return await $fetch("/data/azure_instance_types_eastus.json")}async function $(t){return await $fetch(`/data/aws_instance_types_${t}.json`)}async function C(t,_){await t.exec(L),await t.exec(N);const n=(await t.query(y)).rows?.[0]?.n??0;let a,e=null;if(n===0){a=await p();try{e=await E()}catch{}const s={...a,...e?.instanceTypes?.length?{azure:e.instanceTypes}:{}};for(const[r,o]of Object.entries(s))if(Array.isArray(o))for(const c of o){const l=c.cost??null;await t.query(O,[r,c.name,c.cpu,c.ram,c.ephemeralDisk,l?.["On-Demand"]??null,l?.["1-Year Term"]??null,l?.["3-Year Term"]??null])}}if(!e)try{e=await E()}catch{e=null}if(e?.instanceTypes?.length){const s=new Date().toISOString();for(const r of e.instanceTypes){const o=r.cost??null;await t.query(I,["azure",e.region,r.name,o?.["On-Demand"]??null,o?.["1-Year Term"]??null,o?.["3-Year Term"]??null,s])}}await t.exec(`
    INSERT INTO ${m} (iaas, region, name, cost_on_demand, cost_1_year_term, cost_3_year_term, cost_updated_at)
    SELECT 'azure', 'eastus', name, cost_on_demand, cost_1_year_term, cost_3_year_term, NULL
    FROM ${T}
    WHERE iaas = 'azure' AND (cost_on_demand IS NOT NULL OR cost_1_year_term IS NOT NULL OR cost_3_year_term IS NOT NULL)
    ON CONFLICT (iaas, region, name) DO NOTHING
  `);const i=new Date().toISOString();for(const s of A)try{const r=await $(s);if(!r?.instanceTypes?.length)continue;for(const o of r.instanceTypes){const c=o.cost??null;await t.query(d,["aws",r.region,o.name,c?.["On-Demand"]??null,c?.["1-Year Term"]??null,c?.["3-Year Term"]??null,i])}}catch{}}async function R(t,_,u,n){if(!n)return;const a=n["On-Demand"]??null,e=n["1-Year Term"]??null,i=n["3-Year Term"]??null;if(a==null&&e==null&&i==null)return;const s=new Date().toISOString();await t.query(S,[_,u,a,e,i,s])}async function f(t,_,u,n,a){if(!a)return;const e=a["On-Demand"]??null,i=a["1-Year Term"]??null,s=a["3-Year Term"]??null;if(e==null&&i==null&&s==null)return;const r=new Date().toISOString();await t.query(d,[_,u.trim(),n,e,i,s,r])}async function w(t,_,u){let n=0;if(u?.trim())for(const[a,e]of Object.entries(_))!e||e["On-Demand"]==null&&e["1-Year Term"]==null&&e["3-Year Term"]==null||(await f(t,"azure",u.trim(),a,e),n+=1);else for(const[a,e]of Object.entries(_))!e||e["On-Demand"]==null&&e["1-Year Term"]==null&&e["3-Year Term"]==null||(await R(t,"azure",a,e),n+=1);return n}export{A,w as a,C as s,f as u};
