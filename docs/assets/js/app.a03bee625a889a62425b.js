!function(t){function e(e){for(var a,s,o=e[0],l=e[1],c=e[2],d=0,u=[];d<o.length;d++)s=o[d],n[s]&&u.push(n[s][0]),n[s]=0;for(a in l)Object.prototype.hasOwnProperty.call(l,a)&&(t[a]=l[a]);for(h&&h(e);u.length;)u.shift()();return i.push.apply(i,c||[]),r()}function r(){for(var t,e=0;e<i.length;e++){for(var r=i[e],a=!0,o=1;o<r.length;o++){var l=r[o];0!==n[l]&&(a=!1)}a&&(i.splice(e--,1),t=s(s.s=r[0]))}return t}var a={},n={0:0},i=[];function s(e){if(a[e])return a[e].exports;var r=a[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,s),r.l=!0,r.exports}s.m=t,s.c=a,s.d=function(t,e,r){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(s.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)s.d(r,a,function(e){return t[e]}.bind(null,a));return r},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="";var o=window.webpackJsonp=window.webpackJsonp||[],l=o.push.bind(o);o.push=e,o=o.slice();for(var c=0;c<o.length;c++)e(o[c]);var h=l;i.push([11,1]),r()}([function(t,e,r){var a=r(5);"string"==typeof a&&(a=[[t.i,a,""]]);var n={hmr:!0,transform:void 0,insertInto:void 0};r(6)(a,n);a.locals&&(t.exports=a.locals)},,,,function(t,e,r){"use strict";var a=r(0);r.n(a).a},function(t,e,r){},,,,,,function(t,e,r){"use strict";r.r(e);var a=r(2),n=r.n(a),i=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[t.table?r("div",{staticClass:"results"},[r("p",{staticClass:"results__header"},[t._v("Угаданные слова")]),t._v(" "),t.records.length>0?r("table",[t._m(0),t._v(" "),t._l(t.records,function(e){return r("tr",[r("td",[t._v(t._s(e.id))]),t._v(" "),r("td",[t._v(t._s(e.word))]),t._v(" "),r("td",[t._v(t._s(e.time))])])})],2):r("p",{staticClass:"results__header"},[t._v("Слов нет")]),t._v(" "),r("div",{staticClass:"game__again",on:{click:t.playAgain}},[t._v("Сыграть еще")])]):r("div",{attrs:{id:"game"}},[r("div",{staticClass:"game__header"},[r("p",{staticClass:"game__rules"},[t._v("Нажмите на букву и соберите слово")]),t._v(" "),r("p",{staticClass:"game__time"},[t._v("Время: "),r("span",[t._v(t._s(t.time))])])]),t._v(" "),r("div",{staticClass:"game__wordSpot",style:t.styleBoard},t._l(t.userWord,function(e){return r("div",{staticClass:"game__board__letter"},[t._v(t._s(e))])}),0),t._v(" "),r("div",{staticClass:"game__board"},t._l(t.anagram,function(e){return r("div",{staticClass:"game__board__letter",on:{click:function(e){return t.chooseLetter(e)}}},[t._v(t._s(e))])}),0),t._v(" "),t.userWord.length>0?r("div",{staticClass:"game__reset",on:{click:t.resetGame}},[t._v("Сбросить")]):t._e(),t._v(" "),t.endgame?r("div",{staticClass:"game__end"},[r("div",{staticClass:"game__end__window"},[r("p",{staticClass:"game__end__text"},[t._v(t._s(t.phrase))]),t._v(" "),r("div",{staticClass:"game__end__interface"},[r("div",{staticClass:"game__end__btn tryagain_btn",on:{click:t.newGame}},[t._v("Конечно!")]),t._v(" "),r("div",{staticClass:"game__end__btn enough_btn",on:{click:t.showTable}},[t._v("Я уже устал")])])])]):t._e()])])};i._withStripped=!0;var s={name:"App",data:function(){return{encryptWord:"",anagram:[],userWord:[],api:"",allApis:[],records:[],time:0,endgame:!1,table:!1,phrase:"",styleBoard:{gridTemplateColumns:"",gridTemplateRows:"",width:"",height:"5.3em"},timerState:""}},methods:{getNumberForApi:function(){var t=Math.floor(Math.random()*Math.floor(1366))+2;if(-1===this.allApis.indexOf(t))return this.allApis.push(t),t;this.getNumberForApi()},getWord:function(){var t="https://apidir.pfdo.ru/v1/directory-program-activities/"+this.getNumberForApi();fetch(t).then(function(t){return t.ok?t:Promise.reject(t)}).then(function(t){return t.json()}).then(this.getPhrase)},getPhrase:function(t){"Запись не найдена"===t.result_message?this.getWord():(this.encryptWord=t.data.name.toUpperCase(),console.log("Посдказка: "+this.encryptWord),this.anagram=this.getAnagram(),this.setStyleBoard(this.anagram.length),this.timer("start"))},setStyleBoard:function(t){var e=Math.ceil(screen.width/88);t>e?(this.styleBoard.gridTemplateColumns="repeat("+e+", 5em)",this.styleBoard.gridTemplateRows="repeat("+Math.ceil(t/e)+", 5em)",this.styleBoard.height=5*Math.ceil(t/e)+"em"):this.styleBoard.gridTemplateColumns="repeat("+t+", 5em)"},getAnagram:function(){var t=this.encryptWord;return(t=t.split("").sort(function(){return Math.random()-.5})).forEach(function(e,r){" "===e&&(t[r]="_")}),t},timer:function(t){var e=this,r=(new Date).getTime();this.timerState=t;var a=setInterval(function(){var t,n;e.time=(t=r,n=(new Date).getTime(),parseInt((n-t)/1e3)),"stop"===e.timerState&&(e.time=0,clearInterval(a))},1e3)},chooseLetter:function(t){var e=t.target,r=this.anagram.indexOf(e.textContent);this.userWord.push(e.textContent),this.anagram.splice(r,1),0===this.anagram.length&&this.gameStop()},gameStop:function(){this.endgame=!0,this.timer("stop"),this.userWord.join("")===this.encryptWord?(this.records.push({id:this.records.length+1,word:this.encryptWord,time:this.time}),this.phrase="Вы выиграли! Повторить?"):this.phrase="Буквы кончились... попробовать еще раз?"},resetGame:function(){this.anagram=this.getAnagram(),this.userWord=[],this.timer("start")},newGame:function(){0===this.anagram.length&&this.userWord.join("")!==this.encryptWord?this.resetGame():this.playAgain(),this.userWord=[],this.endgame=!1},playAgain:function(){this.table=!1,this.encryptWord="",this.anagram=[],this.userWord=[],this.api="",this.getWord()},showTable:function(){this.table=!0,this.endgame=!1}},mounted:function(){this.newGame()}},o=(r(4),r(3)),l=Object(o.a)(s,i,[function(){var t=this.$createElement,e=this._self._c||t;return e("tr",[e("td",[this._v("#")]),this._v(" "),e("td",[this._v("Слово")]),this._v(" "),e("td",[this._v("Время (сек)")])])}],!1,null,null,null);l.options.__file="src/App.vue";var c=l.exports;n.a.config.productionTip=!1,new n.a({render:function(t){return t(c)}}).$mount("#app")}]);