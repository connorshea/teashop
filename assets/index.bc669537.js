import{c as e,a as t,d as a,u as r,b as o,r as u,p as s,e as l,f as i,g as p,t as n,w as c,v as d,h as b,i as g,o as m,j as w,k as v,l as h,F as T,m as f,n as S}from"./vendor.ff51c219.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const a of e)if("childList"===a.type)for(const e of a.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const y={autobrewer:{price:10,increaseRate:1.03}},C={autobrewer:{outputMultiplier:2,costMultiplier:10,nextUpgradeCost:100}},M=()=>({lastSaveAt:null,lastNotableTickAt:null,tick:0,cupsOfTea:0,teaPerTick:0,purchases:{autobrewer:{count:0,price:y.autobrewer.price,increaseRate:y.autobrewer.increaseRate}},upgrades:{autobrewer:{level:0,currentOutputMultiplier:1,outputMultiplier:C.autobrewer.outputMultiplier,costMultiplier:C.autobrewer.costMultiplier,nextUpgradeCost:C.autobrewer.nextUpgradeCost}},debugMode:!1}),k=e({plugins:[t({key:"teaShopSave",filter:e=>"triggerSave"===e.type})],state:()=>M(),mutations:{tick(e){e.tick+=1},brewTea(e,t=1){e.cupsOfTea+=t},consumeTea(e,t=1){e.cupsOfTea-=t},buyAutobrewer(e,t=1){e.purchases.autobrewer.count+=t},increasePrice(e,t){null===t.amount&&(t.amount=1),e.purchases[t.purchasable].price*=Math.pow(e.purchases[t.purchasable].increaseRate,t.amount)},upgradeUpgradable(e,t){e.upgrades[t.upgradable].level+=1,e.upgrades[t.upgradable].currentOutputMultiplier*=e.upgrades[t.upgradable].outputMultiplier,e.upgrades[t.upgradable].nextUpgradeCost*=e.upgrades[t.upgradable].costMultiplier},triggerSave(e){e.lastSaveAt=Date.now()},hardReset(e){null!==localStorage.getItem("teaShopSave")&&localStorage.removeItem("teaShopSave"),k.replaceState(M())},toggleDebugMode(e){e.debugMode=!e.debugMode},recalculateTeaPerTick(e){e.teaPerTick=e.purchases.autobrewer.count*e.upgrades.autobrewer.currentOutputMultiplier/5}},actions:{tick(e){if(e.state.tick%5==0){let t=Date.now();e.state.debugMode&&null!==e.state.lastNotableTickAt&&(console.log(t-e.state.lastNotableTickAt+"ms since last notable tick."),console.log(`${e.state.cupsOfTea} cups of tea`)),e.state.lastNotableTickAt=t}e.commit("tick"),e.dispatch("autobrew"),e.state.tick%150==0&&e.commit("triggerSave")},brewTea(e){e.commit("brewTea")},upgradeUpgradable(e,{upgradable:t}){e.commit("consumeTea",e.state.upgrades[t].nextUpgradeCost),e.commit("upgradeUpgradable",{upgradable:t}),e.commit("recalculateTeaPerTick")},buyAutobrewer(e,{amount:t}){let a=e.state.purchases.autobrewer.increaseRate,r=e.state.purchases.autobrewer.price*(1-Math.pow(a,t))/(1-a);e.commit("consumeTea",r),e.commit("increasePrice",{purchasable:"autobrewer",amount:t}),e.commit("buyAutobrewer",t),e.commit("recalculateTeaPerTick")},autobrew(e){e.commit("brewTea",e.state.teaPerTick)}}});var A=a({name:"Options",setup(e,t){const a=r(),s=o((()=>a.state.lastSaveAt)),l=o((()=>a.state.debugMode)),i=u("Export Save (copies to clipboard)"),p=u(!1),n=()=>{p.value=!p.value},c=u("");return{hardResetGame:()=>{confirm("This will permanently erase ALL your progress, nothing will be persisted. Are you absolutely sure you want to reset your game?")&&a.commit("hardReset")},lastSaveAt:s,debugMode:l,toggleDebugMode:()=>a.commit("toggleDebugMode"),importSave:()=>{n();try{let e=JSON.parse(atob(c.value));a.replaceState(e),c.value=""}catch(e){alert("There was an error with the imported save data. Are you sure you have a valid save?")}},importedSaveText:c,toggleImportTextArea:n,importToggled:p,exportButtonText:i,exportSave:()=>{let e=localStorage.getItem("teaShopSave");null!==e&&navigator.clipboard.writeText(btoa(e)).then((()=>{i.value="Copied!",setTimeout((()=>{i.value="Export Save (copies to clipboard)"}),2e3)}))},saveGame:()=>a.commit("triggerSave")}}});s("data-v-6f1e88c8");const x=p("h4",null,"Options",-1),O={class:"buttons"},U={class:"import-text-area-container"},P=["disabled"];l(),A.render=function(e,t,a,r,o,u){return m(),i("div",null,[x,p("div",O,[p("button",{type:"button",onClick:t[0]||(t[0]=(...t)=>e.saveGame&&e.saveGame(...t))}," Save Game "),p("button",{type:"button",onClick:t[1]||(t[1]=(...t)=>e.toggleImportTextArea&&e.toggleImportTextArea(...t))},n(e.importToggled?"Close Import Field":"Import Save"),1),c(p("div",U,[c(p("textarea",{placeholder:"Paste save game data here and hit Enter",onKeypress:t[2]||(t[2]=b(((...t)=>e.importSave&&e.importSave(...t)),["enter"])),"onUpdate:modelValue":t[3]||(t[3]=t=>e.importedSaveText=t)},null,544),[[g,e.importedSaveText]])],512),[[d,e.importToggled]]),p("button",{type:"button",disabled:null===e.lastSaveAt,onClick:t[4]||(t[4]=(...t)=>e.exportSave&&e.exportSave(...t))},n(e.exportButtonText),9,P),p("button",{type:"button",onClick:t[5]||(t[5]=(...t)=>e.hardResetGame&&e.hardResetGame(...t))}," Hard Reset "),p("button",{type:"button",onClick:t[6]||(t[6]=(...t)=>e.toggleDebugMode&&e.toggleDebugMode(...t))},n(!0===e.debugMode?"Disable Debug Mode":"Enable Debug Mode"),1)])])},A.__scopeId="data-v-6f1e88c8";var R=a({name:"TeaShop",components:{Options:A},setup(e,t){const a=r(),u=o((()=>a.state.cupsOfTea)),s=o((()=>Math.round(5*a.state.teaPerTick))),l=o((()=>Math.round(a.state.cupsOfTea))),i=o((()=>a.state.purchases.autobrewer.count)),p=o((()=>a.state.purchases.autobrewer.price)),n=o((()=>e=>Math.round(p.value*((1-Math.pow(a.state.purchases.autobrewer.increaseRate,e))/(1-a.state.purchases.autobrewer.increaseRate))))),c=o((()=>a.state.upgrades.autobrewer.nextUpgradeCost));return setInterval((()=>{a.state.debugMode&&console.log(`${u.value} cups of tea, ${l.value} rounded cups of tea`),a.dispatch("tick")}),200),{cupsOfTea:u,teaPerSecond:s,roundedCupsOfTea:l,autobrewerCount:i,autobrewerCost:p,multipleAutobrewerCost:n,autobrewerUpgradeCost:c,brewTea:()=>a.dispatch("brewTea"),buyAutobrewer:e=>a.dispatch("buyAutobrewer",{amount:e}),upgradeAutobrewer:()=>a.dispatch("upgradeUpgradable",{upgradable:"autobrewer"})}}});s("data-v-275c60ec");const I=p("h1",null,"Tea Shop",-1),$={key:0},D={class:"buttons"},N=["disabled"],z=["disabled"],G=p("br",null,null,-1),L=p("h4",null,"Upgrades",-1),B={class:"buttons"},E=["disabled"],_=p("br",null,null,-1),j=p("br",null,null,-1);l(),R.render=function(e,t,a,r,o,u){const s=w("Options");return m(),i(T,null,[I,p("p",null,n(e.roundedCupsOfTea)+" "+n(e.$filters.pluralize(e.roundedCupsOfTea,"Cup"))+" of Tea",1),p("p",null,"("+n(e.teaPerSecond)+" "+n(e.$filters.pluralize(e.teaPerSecond,"cup"))+"/sec)",1),e.autobrewerCount>0?(m(),i("p",$,n(e.autobrewerCount)+" "+n(e.$filters.pluralize(e.autobrewerCount,"Autobrewer")),1)):v("",!0),p("div",D,[p("button",{type:"button",onClick:t[0]||(t[0]=(...t)=>e.brewTea&&e.brewTea(...t))}," Brew a cup of tea "),p("button",{type:"button",disabled:e.cupsOfTea<Math.ceil(e.autobrewerCost),onClick:t[1]||(t[1]=t=>e.buyAutobrewer(1))}," Buy an autobrewer ("+n(Math.round(e.autobrewerCost))+" "+n(e.$filters.pluralize(e.autobrewerCost,"cup"))+") ",9,N),p("button",{type:"button",disabled:e.cupsOfTea<Math.ceil(e.multipleAutobrewerCost(10)),onClick:t[2]||(t[2]=t=>e.buyAutobrewer(10))}," Buy 10 autobrewers ("+n(e.multipleAutobrewerCost(10))+" "+n(e.$filters.pluralize(e.multipleAutobrewerCost(10),"cup"))+") ",9,z)]),G,p("div",null,[L,p("div",B,[p("button",{type:"button",disabled:e.cupsOfTea<Math.ceil(e.autobrewerUpgradeCost),onClick:t[3]||(t[3]=(...t)=>e.upgradeAutobrewer&&e.upgradeAutobrewer(...t))}," Upgrade autobrewers ("+n(e.autobrewerUpgradeCost)+" "+n(e.$filters.pluralize(e.autobrewerUpgradeCost,"cup"))+") ",9,E)])]),_,j,h(s)],64)},R.__scopeId="data-v-275c60ec";var F=a({name:"App",components:{TeaShop:R}});F.render=function(e,t,a,r,o,u){const s=w("TeaShop");return m(),f(s)};const K=S(F);K.use(k),K.config.globalProperties.$filters={},K.config.globalProperties.$filters.pluralize=(e,t,a=null)=>(null===a&&(a=`${t}s`),e>1||0===e?a:t),K.mount("#app");
