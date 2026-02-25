import{R as i}from"./CRHE5z8Z.js";const u=`
  SELECT name, cpu, ram, ephemeral_disk,
         cost_on_demand, cost_1_year_term, cost_3_year_term
  FROM instance_types
  WHERE iaas = $1
  ORDER BY name
`,l=`
  SELECT t.name, t.cpu, t.ram, t.ephemeral_disk,
         p.cost_on_demand, p.cost_1_year_term, p.cost_3_year_term, p.cost_updated_at
  FROM instance_types t
  LEFT JOIN instance_type_pricing p ON t.iaas = p.iaas AND t.name = p.name AND p.region = $2
  WHERE t.iaas = $1
  ORDER BY t.name
`,E=["name","cpu","ram","ephemeral_disk","cost_on_demand","cost_1_year_term","cost_3_year_term","cost_updated_at"];function y(a){const n={};for(const t of E){const s=a.findIndex(e=>e.name===t);n[t]=s>=0?s:-1}return n}function R(a,n){const t=o=>n[o]>=0?a[n[o]]:void 0,s=t("cost_on_demand"),e=t("cost_1_year_term"),c=t("cost_3_year_term"),r=s!=null||e!=null||c!=null;return{name:t("name"),cpu:t("cpu"),ram:t("ram"),ephemeralDisk:t("ephemeral_disk"),cost:r?{"On-Demand":s??null,"1-Year Term":e??null,"3-Year Term":c??null}:null,costUpdatedAt:t("cost_updated_at")??null}}function f(){const a=i();async function n(t,s){const e=s?.trim(),c=e?l:u,r=e?[t,e]:[t],o=await a.query(c,r,{rowMode:"array"}),_=o.rows??[],m=o.fields??[],p=y(m);return _.map(d=>R(d,p))}return{getInstanceTypes:n}}export{f as u};
