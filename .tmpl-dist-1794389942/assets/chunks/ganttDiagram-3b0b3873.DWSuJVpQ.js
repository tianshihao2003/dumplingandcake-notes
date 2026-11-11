import{g as me,s as ke,y as ye,z as ge,a as pe,b as ve,c as nt,d as kt,e as Te,au as B,l as Tt,k as xe,j as be,B as we,C as _e}from"../app.BYxqKliN.js";import{t as De,m as Ce,a as Se,l as Ee,h as Me,b as Nt,c as Ht,d as Ae,e as Ie,f as Ye,g as Le,i as Fe,j as We,k as Ve,n as Xt,o as Gt,p as Ut,s as qt,q as jt}from"./d3-scale.Ccy7MqWO.js";import"./framework.B28LkSoM.js";import"./theme.CSyVAbQP.js";function Oe(t){return t}var gt=1,_t=2,St=3,yt=4,Zt=1e-6;function ze(t){return"translate("+t+",0)"}function Pe(t){return"translate(0,"+t+")"}function Re(t){return e=>+t(e)}function Be(t,e){return e=Math.max(0,t.bandwidth()-e*2)/2,t.round()&&(e=Math.round(e)),r=>+t(r)+e}function Ne(){return!this.__axis}function ee(t,e){var r=[],n=null,i=null,o=6,c=6,g=3,m=typeof window<"u"&&window.devicePixelRatio>1?0:.5,x=t===gt||t===yt?-1:1,v=t===yt||t===_t?"x":"y",S=t===gt||t===St?ze:Pe;function _(k){var L=n??(e.ticks?e.ticks.apply(e,r):e.domain()),D=i??(e.tickFormat?e.tickFormat.apply(e,r):Oe),O=Math.max(o,0)+g,P=e.range(),G=+P[0]+m,N=+P[P.length-1]+m,U=(e.bandwidth?Be:Re)(e.copy(),m),H=k.selection?k.selection():k,R=H.selectAll(".domain").data([null]),W=H.selectAll(".tick").data(L,e).order(),y=W.exit(),C=W.enter().append("g").attr("class","tick"),w=W.select("line"),p=W.select("text");R=R.merge(R.enter().insert("path",".tick").attr("class","domain").attr("stroke","currentColor")),W=W.merge(C),w=w.merge(C.append("line").attr("stroke","currentColor").attr(v+"2",x*o)),p=p.merge(C.append("text").attr("fill","currentColor").attr(v,x*O).attr("dy",t===gt?"0em":t===St?"0.71em":"0.32em")),k!==H&&(R=R.transition(k),W=W.transition(k),w=w.transition(k),p=p.transition(k),y=y.transition(k).attr("opacity",Zt).attr("transform",function(a){return isFinite(a=U(a))?S(a+m):this.getAttribute("transform")}),C.attr("opacity",Zt).attr("transform",function(a){var f=this.parentNode.__axis;return S((f&&isFinite(f=f(a))?f:U(a))+m)})),y.remove(),R.attr("d",t===yt||t===_t?c?"M"+x*c+","+G+"H"+m+"V"+N+"H"+x*c:"M"+m+","+G+"V"+N:c?"M"+G+","+x*c+"V"+m+"H"+N+"V"+x*c:"M"+G+","+m+"H"+N),W.attr("opacity",1).attr("transform",function(a){return S(U(a)+m)}),w.attr(v+"2",x*o),p.attr(v,x*O).text(D),H.filter(Ne).attr("fill","none").attr("font-size",10).attr("font-family","sans-serif").attr("text-anchor",t===_t?"start":t===yt?"end":"middle"),H.each(function(){this.__axis=U})}return _.scale=function(k){return arguments.length?(e=k,_):e},_.ticks=function(){return r=Array.from(arguments),_},_.tickArguments=function(k){return arguments.length?(r=k==null?[]:Array.from(k),_):r.slice()},_.tickValues=function(k){return arguments.length?(n=k==null?null:Array.from(k),_):n&&n.slice()},_.tickFormat=function(k){return arguments.length?(i=k,_):i},_.tickSize=function(k){return arguments.length?(o=c=+k,_):o},_.tickSizeInner=function(k){return arguments.length?(o=+k,_):o},_.tickSizeOuter=function(k){return arguments.length?(c=+k,_):c},_.tickPadding=function(k){return arguments.length?(g=+k,_):g},_.offset=function(k){return arguments.length?(m=+k,_):m},_}function He(t){return ee(gt,t)}function Xe(t){return ee(St,t)}var Dt="day",Ge="week",Ue="year",qe="YYYY-MM-DDTHH:mm:ssZ",je="isoweek";const Ze=function(t,e,r){var n=function(m,x){var v=(x?r.utc:r)().year(m).startOf(Ue),S=4-v.isoWeekday();return v.isoWeekday()>4&&(S+=7),v.add(S,Dt)},i=function(m){return m.add(4-m.isoWeekday(),Dt)},o=e.prototype;o.isoWeekYear=function(){var g=i(this);return g.year()},o.isoWeek=function(g){if(!this.$utils().u(g))return this.add((g-this.isoWeek())*7,Dt);var m=i(this),x=n(this.isoWeekYear(),this.$u);return m.diff(x,Ge)+1},o.isoWeekday=function(g){return this.$utils().u(g)?this.day()||7:this.day(this.day()%7?g:g-7)};var c=o.startOf;o.startOf=function(g,m){var x=this.$utils(),v=x.u(m)?!0:m,S=x.p(g);return S===je?v?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf("day"):c.bind(this)(g,m)}};var Qe=function(e){return e.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,function(r,n,i){return n||i.slice(1)})},Je={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},Ke=function(e,r){return e.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,function(n,i,o){var c=o&&o.toUpperCase();return i||r[o]||Je[o]||Qe(r[c])})},$e=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,Qt=/\d/,ct=/\d\d/,tr=/\d{3}/,er=/\d{4}/,j=/\d\d?/,rr=/[+-]?\d+/,nr=/[+-]\d\d:?(\d\d)?|Z/,lt=/\d*[^-_:/,()\s\d]+/,$={},re=function(e){return e=+e,e+(e>68?1900:2e3)};function ir(t){if(!t||t==="Z")return 0;var e=t.match(/([+-]|\d\d)/g),r=+(e[1]*60)+(+e[2]||0);return r===0?0:e[0]==="+"?-r:r}var z=function(e){return function(r){this[e]=+r}},Jt=[nr,function(t){var e=this.zone||(this.zone={});e.offset=ir(t)}],Ct=function(e){var r=$[e];return r&&(r.indexOf?r:r.s.concat(r.f))},Kt=function(e,r){var n,i=$,o=i.meridiem;if(!o)n=e===(r?"pm":"PM");else for(var c=1;c<=24;c+=1)if(e.indexOf(o(c,0,r))>-1){n=c>12;break}return n},sr={A:[lt,function(t){this.afternoon=Kt(t,!1)}],a:[lt,function(t){this.afternoon=Kt(t,!0)}],Q:[Qt,function(t){this.month=(t-1)*3+1}],S:[Qt,function(t){this.milliseconds=+t*100}],SS:[ct,function(t){this.milliseconds=+t*10}],SSS:[tr,function(t){this.milliseconds=+t}],s:[j,z("seconds")],ss:[j,z("seconds")],m:[j,z("minutes")],mm:[j,z("minutes")],H:[j,z("hours")],h:[j,z("hours")],HH:[j,z("hours")],hh:[j,z("hours")],D:[j,z("day")],DD:[ct,z("day")],Do:[lt,function(t){var e=$,r=e.ordinal,n=t.match(/\d+/);if(this.day=n[0],!!r)for(var i=1;i<=31;i+=1)r(i).replace(/\[|\]/g,"")===t&&(this.day=i)}],w:[j,z("week")],ww:[ct,z("week")],M:[j,z("month")],MM:[ct,z("month")],MMM:[lt,function(t){var e=Ct("months"),r=Ct("monthsShort"),n=(r||e.map(function(i){return i.slice(0,3)})).indexOf(t)+1;if(n<1)throw new Error;this.month=n%12||n}],MMMM:[lt,function(t){var e=Ct("months"),r=e.indexOf(t)+1;if(r<1)throw new Error;this.month=r%12||r}],Y:[rr,z("year")],YY:[ct,function(t){this.year=re(t)}],YYYY:[er,z("year")],Z:Jt,ZZ:Jt};function ar(t){var e=t.afternoon;if(e!==void 0){var r=t.hours;e?r<12&&(t.hours+=12):r===12&&(t.hours=0),delete t.afternoon}}function or(t){t=Ke(t,$&&$.formats);for(var e=t.match($e),r=e.length,n=0;n<r;n+=1){var i=e[n],o=sr[i],c=o&&o[0],g=o&&o[1];g?e[n]={regex:c,parser:g}:e[n]=i.replace(/^\[|\]$/g,"")}return function(m){for(var x={},v=0,S=0;v<r;v+=1){var _=e[v];if(typeof _=="string")S+=_.length;else{var k=_.regex,L=_.parser,D=m.slice(S),O=k.exec(D),P=O[0];L.call(x,P),m=m.replace(P,"")}}return ar(x),x}}var cr=function(e,r,n,i){try{if(["x","X"].indexOf(r)>-1)return new Date((r==="X"?1e3:1)*e);var o=or(r),c=o(e),g=c.year,m=c.month,x=c.day,v=c.hours,S=c.minutes,_=c.seconds,k=c.milliseconds,L=c.zone,D=c.week,O=new Date,P=x||(!g&&!m?O.getDate():1),G=g||O.getFullYear(),N=0;g&&!m||(N=m>0?m-1:O.getMonth());var U=v||0,H=S||0,R=_||0,W=k||0;if(L)return new Date(Date.UTC(G,N,P,U,H,R,W+L.offset*60*1e3));if(n)return new Date(Date.UTC(G,N,P,U,H,R,W));var y;return y=new Date(G,N,P,U,H,R,W),D&&(y=i(y).week(D).toDate()),y}catch{return new Date("")}};const lr=function(t,e,r){r.p.customParseFormat=!0,t&&t.parseTwoDigitYear&&(re=t.parseTwoDigitYear);var n=e.prototype,i=n.parse;n.parse=function(o){var c=o.date,g=o.utc,m=o.args;this.$u=g;var x=m[1];if(typeof x=="string"){var v=m[2]===!0,S=m[3]===!0,_=v||S,k=m[2];S&&(k=m[2]),$=this.$locale(),!v&&k&&($=r.Ls[k]),this.$d=cr(c,x,g,r),this.init(),k&&k!==!0&&(this.$L=this.locale(k).$L),_&&c!=this.format(x)&&(this.$d=new Date("")),$={}}else if(x instanceof Array)for(var L=x.length,D=1;D<=L;D+=1){m[1]=x[D-1];var O=r.apply(this,m);if(O.isValid()){this.$d=O.$d,this.$L=O.$L,this.init();break}D===L&&(this.$d=new Date(""))}else i.call(this,o)}},ur=function(t,e){var r=e.prototype,n=r.format;r.format=function(i){var o=this,c=this.$locale();if(!this.isValid())return n.bind(this)(i);var g=this.$utils(),m=i||qe,x=m.replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,function(v){switch(v){case"Q":return Math.ceil((o.$M+1)/3);case"Do":return c.ordinal(o.$D);case"gggg":return o.weekYear();case"GGGG":return o.isoWeekYear();case"wo":return c.ordinal(o.week(),"W");case"w":case"ww":return g.s(o.week(),v==="w"?1:2,"0");case"W":case"WW":return g.s(o.isoWeek(),v==="W"?1:2,"0");case"k":case"kk":return g.s(String(o.$H===0?24:o.$H),v==="k"?1:2,"0");case"X":return Math.floor(o.$d.getTime()/1e3);case"x":return o.$d.getTime();case"z":return"["+o.offsetName()+"]";case"zzz":return"["+o.offsetName("long")+"]";default:return v}});return n.bind(this)(x)}};var Et=function(){var t=function(p,a,f,h){for(f=f||{},h=p.length;h--;f[p[h]]=a);return f},e=[6,8,10,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,30,32,33,35,37],r=[1,25],n=[1,26],i=[1,27],o=[1,28],c=[1,29],g=[1,30],m=[1,31],x=[1,9],v=[1,10],S=[1,11],_=[1,12],k=[1,13],L=[1,14],D=[1,15],O=[1,16],P=[1,18],G=[1,19],N=[1,20],U=[1,21],H=[1,22],R=[1,24],W=[1,32],y={trace:function(){},yy:{},symbols_:{error:2,start:3,gantt:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NL:10,weekday:11,weekday_monday:12,weekday_tuesday:13,weekday_wednesday:14,weekday_thursday:15,weekday_friday:16,weekday_saturday:17,weekday_sunday:18,dateFormat:19,inclusiveEndDates:20,topAxis:21,axisFormat:22,tickInterval:23,excludes:24,includes:25,todayMarker:26,title:27,acc_title:28,acc_title_value:29,acc_descr:30,acc_descr_value:31,acc_descr_multiline_value:32,section:33,clickStatement:34,taskTxt:35,taskData:36,click:37,callbackname:38,callbackargs:39,href:40,clickStatementDebug:41,$accept:0,$end:1},terminals_:{2:"error",4:"gantt",6:"EOF",8:"SPACE",10:"NL",12:"weekday_monday",13:"weekday_tuesday",14:"weekday_wednesday",15:"weekday_thursday",16:"weekday_friday",17:"weekday_saturday",18:"weekday_sunday",19:"dateFormat",20:"inclusiveEndDates",21:"topAxis",22:"axisFormat",23:"tickInterval",24:"excludes",25:"includes",26:"todayMarker",27:"title",28:"acc_title",29:"acc_title_value",30:"acc_descr",31:"acc_descr_value",32:"acc_descr_multiline_value",33:"section",35:"taskTxt",36:"taskData",37:"click",38:"callbackname",39:"callbackargs",40:"href"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,1],[9,2],[34,2],[34,3],[34,3],[34,4],[34,3],[34,4],[34,2],[41,2],[41,3],[41,3],[41,4],[41,3],[41,4],[41,2]],performAction:function(a,f,h,l,T,s,V){var d=s.length-1;switch(T){case 1:return s[d-1];case 2:this.$=[];break;case 3:s[d-1].push(s[d]),this.$=s[d-1];break;case 4:case 5:this.$=s[d];break;case 6:case 7:this.$=[];break;case 8:l.setWeekday("monday");break;case 9:l.setWeekday("tuesday");break;case 10:l.setWeekday("wednesday");break;case 11:l.setWeekday("thursday");break;case 12:l.setWeekday("friday");break;case 13:l.setWeekday("saturday");break;case 14:l.setWeekday("sunday");break;case 15:l.setDateFormat(s[d].substr(11)),this.$=s[d].substr(11);break;case 16:l.enableInclusiveEndDates(),this.$=s[d].substr(18);break;case 17:l.TopAxis(),this.$=s[d].substr(8);break;case 18:l.setAxisFormat(s[d].substr(11)),this.$=s[d].substr(11);break;case 19:l.setTickInterval(s[d].substr(13)),this.$=s[d].substr(13);break;case 20:l.setExcludes(s[d].substr(9)),this.$=s[d].substr(9);break;case 21:l.setIncludes(s[d].substr(9)),this.$=s[d].substr(9);break;case 22:l.setTodayMarker(s[d].substr(12)),this.$=s[d].substr(12);break;case 24:l.setDiagramTitle(s[d].substr(6)),this.$=s[d].substr(6);break;case 25:this.$=s[d].trim(),l.setAccTitle(this.$);break;case 26:case 27:this.$=s[d].trim(),l.setAccDescription(this.$);break;case 28:l.addSection(s[d].substr(8)),this.$=s[d].substr(8);break;case 30:l.addTask(s[d-1],s[d]),this.$="task";break;case 31:this.$=s[d-1],l.setClickEvent(s[d-1],s[d],null);break;case 32:this.$=s[d-2],l.setClickEvent(s[d-2],s[d-1],s[d]);break;case 33:this.$=s[d-2],l.setClickEvent(s[d-2],s[d-1],null),l.setLink(s[d-2],s[d]);break;case 34:this.$=s[d-3],l.setClickEvent(s[d-3],s[d-2],s[d-1]),l.setLink(s[d-3],s[d]);break;case 35:this.$=s[d-2],l.setClickEvent(s[d-2],s[d],null),l.setLink(s[d-2],s[d-1]);break;case 36:this.$=s[d-3],l.setClickEvent(s[d-3],s[d-1],s[d]),l.setLink(s[d-3],s[d-2]);break;case 37:this.$=s[d-1],l.setLink(s[d-1],s[d]);break;case 38:case 44:this.$=s[d-1]+" "+s[d];break;case 39:case 40:case 42:this.$=s[d-2]+" "+s[d-1]+" "+s[d];break;case 41:case 43:this.$=s[d-3]+" "+s[d-2]+" "+s[d-1]+" "+s[d];break}},table:[{3:1,4:[1,2]},{1:[3]},t(e,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:17,12:r,13:n,14:i,15:o,16:c,17:g,18:m,19:x,20:v,21:S,22:_,23:k,24:L,25:D,26:O,27:P,28:G,30:N,32:U,33:H,34:23,35:R,37:W},t(e,[2,7],{1:[2,1]}),t(e,[2,3]),{9:33,11:17,12:r,13:n,14:i,15:o,16:c,17:g,18:m,19:x,20:v,21:S,22:_,23:k,24:L,25:D,26:O,27:P,28:G,30:N,32:U,33:H,34:23,35:R,37:W},t(e,[2,5]),t(e,[2,6]),t(e,[2,15]),t(e,[2,16]),t(e,[2,17]),t(e,[2,18]),t(e,[2,19]),t(e,[2,20]),t(e,[2,21]),t(e,[2,22]),t(e,[2,23]),t(e,[2,24]),{29:[1,34]},{31:[1,35]},t(e,[2,27]),t(e,[2,28]),t(e,[2,29]),{36:[1,36]},t(e,[2,8]),t(e,[2,9]),t(e,[2,10]),t(e,[2,11]),t(e,[2,12]),t(e,[2,13]),t(e,[2,14]),{38:[1,37],40:[1,38]},t(e,[2,4]),t(e,[2,25]),t(e,[2,26]),t(e,[2,30]),t(e,[2,31],{39:[1,39],40:[1,40]}),t(e,[2,37],{38:[1,41]}),t(e,[2,32],{40:[1,42]}),t(e,[2,33]),t(e,[2,35],{39:[1,43]}),t(e,[2,34]),t(e,[2,36])],defaultActions:{},parseError:function(a,f){if(f.recoverable)this.trace(a);else{var h=new Error(a);throw h.hash=f,h}},parse:function(a){var f=this,h=[0],l=[],T=[null],s=[],V=this.table,d="",u=0,b=0,Y=2,M=1,A=s.slice.call(arguments,1),E=Object.create(this.lexer),I={yy:{}};for(var at in this.yy)Object.prototype.hasOwnProperty.call(this.yy,at)&&(I.yy[at]=this.yy[at]);E.setInput(a,I.yy),I.yy.lexer=E,I.yy.parser=this,typeof E.yylloc>"u"&&(E.yylloc={});var ot=E.yylloc;s.push(ot);var fe=E.options&&E.options.ranges;typeof I.yy.parseError=="function"?this.parseError=I.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function he(){var J;return J=l.pop()||E.lex()||M,typeof J!="number"&&(J instanceof Array&&(l=J,J=l.pop()),J=f.symbols_[J]||J),J}for(var X,tt,q,bt,rt={},ht,Q,Bt,mt;;){if(tt=h[h.length-1],this.defaultActions[tt]?q=this.defaultActions[tt]:((X===null||typeof X>"u")&&(X=he()),q=V[tt]&&V[tt][X]),typeof q>"u"||!q.length||!q[0]){var wt="";mt=[];for(ht in V[tt])this.terminals_[ht]&&ht>Y&&mt.push("'"+this.terminals_[ht]+"'");E.showPosition?wt="Parse error on line "+(u+1)+`:
`+E.showPosition()+`
Expecting `+mt.join(", ")+", got '"+(this.terminals_[X]||X)+"'":wt="Parse error on line "+(u+1)+": Unexpected "+(X==M?"end of input":"'"+(this.terminals_[X]||X)+"'"),this.parseError(wt,{text:E.match,token:this.terminals_[X]||X,line:E.yylineno,loc:ot,expected:mt})}if(q[0]instanceof Array&&q.length>1)throw new Error("Parse Error: multiple actions possible at state: "+tt+", token: "+X);switch(q[0]){case 1:h.push(X),T.push(E.yytext),s.push(E.yylloc),h.push(q[1]),X=null,b=E.yyleng,d=E.yytext,u=E.yylineno,ot=E.yylloc;break;case 2:if(Q=this.productions_[q[1]][1],rt.$=T[T.length-Q],rt._$={first_line:s[s.length-(Q||1)].first_line,last_line:s[s.length-1].last_line,first_column:s[s.length-(Q||1)].first_column,last_column:s[s.length-1].last_column},fe&&(rt._$.range=[s[s.length-(Q||1)].range[0],s[s.length-1].range[1]]),bt=this.performAction.apply(rt,[d,b,u,I.yy,q[1],T,s].concat(A)),typeof bt<"u")return bt;Q&&(h=h.slice(0,-1*Q*2),T=T.slice(0,-1*Q),s=s.slice(0,-1*Q)),h.push(this.productions_[q[1]][0]),T.push(rt.$),s.push(rt._$),Bt=V[h[h.length-2]][h[h.length-1]],h.push(Bt);break;case 3:return!0}}return!0}},C=function(){var p={EOF:1,parseError:function(f,h){if(this.yy.parser)this.yy.parser.parseError(f,h);else throw new Error(f)},setInput:function(a,f){return this.yy=f||this.yy||{},this._input=a,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var a=this._input[0];this.yytext+=a,this.yyleng++,this.offset++,this.match+=a,this.matched+=a;var f=a.match(/(?:\r\n?|\n).*/g);return f?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),a},unput:function(a){var f=a.length,h=a.split(/(?:\r\n?|\n)/g);this._input=a+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-f),this.offset-=f;var l=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),h.length-1&&(this.yylineno-=h.length-1);var T=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:h?(h.length===l.length?this.yylloc.first_column:0)+l[l.length-h.length].length-h[0].length:this.yylloc.first_column-f},this.options.ranges&&(this.yylloc.range=[T[0],T[0]+this.yyleng-f]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(a){this.unput(this.match.slice(a))},pastInput:function(){var a=this.matched.substr(0,this.matched.length-this.match.length);return(a.length>20?"...":"")+a.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var a=this.match;return a.length<20&&(a+=this._input.substr(0,20-a.length)),(a.substr(0,20)+(a.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var a=this.pastInput(),f=new Array(a.length+1).join("-");return a+this.upcomingInput()+`
`+f+"^"},test_match:function(a,f){var h,l,T;if(this.options.backtrack_lexer&&(T={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(T.yylloc.range=this.yylloc.range.slice(0))),l=a[0].match(/(?:\r\n?|\n).*/g),l&&(this.yylineno+=l.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:l?l[l.length-1].length-l[l.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+a[0].length},this.yytext+=a[0],this.match+=a[0],this.matches=a,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(a[0].length),this.matched+=a[0],h=this.performAction.call(this,this.yy,this,f,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),h)return h;if(this._backtrack){for(var s in T)this[s]=T[s];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var a,f,h,l;this._more||(this.yytext="",this.match="");for(var T=this._currentRules(),s=0;s<T.length;s++)if(h=this._input.match(this.rules[T[s]]),h&&(!f||h[0].length>f[0].length)){if(f=h,l=s,this.options.backtrack_lexer){if(a=this.test_match(h,T[s]),a!==!1)return a;if(this._backtrack){f=!1;continue}else return!1}else if(!this.options.flex)break}return f?(a=this.test_match(f,T[l]),a!==!1?a:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var f=this.next();return f||this.lex()},begin:function(f){this.conditionStack.push(f)},popState:function(){var f=this.conditionStack.length-1;return f>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(f){return f=this.conditionStack.length-1-Math.abs(f||0),f>=0?this.conditionStack[f]:"INITIAL"},pushState:function(f){this.begin(f)},stateStackSize:function(){return this.conditionStack.length},options:{"case-insensitive":!0},performAction:function(f,h,l,T){switch(l){case 0:return this.begin("open_directive"),"open_directive";case 1:return this.begin("acc_title"),28;case 2:return this.popState(),"acc_title_value";case 3:return this.begin("acc_descr"),30;case 4:return this.popState(),"acc_descr_value";case 5:this.begin("acc_descr_multiline");break;case 6:this.popState();break;case 7:return"acc_descr_multiline_value";case 8:break;case 9:break;case 10:break;case 11:return 10;case 12:break;case 13:break;case 14:this.begin("href");break;case 15:this.popState();break;case 16:return 40;case 17:this.begin("callbackname");break;case 18:this.popState();break;case 19:this.popState(),this.begin("callbackargs");break;case 20:return 38;case 21:this.popState();break;case 22:return 39;case 23:this.begin("click");break;case 24:this.popState();break;case 25:return 37;case 26:return 4;case 27:return 19;case 28:return 20;case 29:return 21;case 30:return 22;case 31:return 23;case 32:return 25;case 33:return 24;case 34:return 26;case 35:return 12;case 36:return 13;case 37:return 14;case 38:return 15;case 39:return 16;case 40:return 17;case 41:return 18;case 42:return"date";case 43:return 27;case 44:return"accDescription";case 45:return 33;case 46:return 35;case 47:return 36;case 48:return":";case 49:return 6;case 50:return"INVALID"}},rules:[/^(?:%%\{)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,/^(?:weekday\s+monday\b)/i,/^(?:weekday\s+tuesday\b)/i,/^(?:weekday\s+wednesday\b)/i,/^(?:weekday\s+thursday\b)/i,/^(?:weekday\s+friday\b)/i,/^(?:weekday\s+saturday\b)/i,/^(?:weekday\s+sunday\b)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,/^(?:title\s[^\n]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^\n]+)/i,/^(?:[^:\n]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[6,7],inclusive:!1},acc_descr:{rules:[4],inclusive:!1},acc_title:{rules:[2],inclusive:!1},callbackargs:{rules:[21,22],inclusive:!1},callbackname:{rules:[18,19,20],inclusive:!1},href:{rules:[15,16],inclusive:!1},click:{rules:[24,25],inclusive:!1},INITIAL:{rules:[0,1,3,5,8,9,10,11,12,13,14,17,23,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],inclusive:!0}}};return p}();y.lexer=C;function w(){this.yy={}}return w.prototype=y,y.Parser=w,new w}();Et.parser=Et;const dr=Et;B.extend(Ze);B.extend(lr);B.extend(ur);let Z="",Yt="",Lt,Ft="",ut=[],dt=[],Wt={},Vt=[],xt=[],st="",Ot="";const ne=["active","done","crit","milestone"];let zt=[],ft=!1,Pt=!1,Rt="sunday",Mt=0;const fr=function(){Vt=[],xt=[],st="",zt=[],pt=0,It=void 0,vt=void 0,F=[],Z="",Yt="",Ot="",Lt=void 0,Ft="",ut=[],dt=[],ft=!1,Pt=!1,Mt=0,Wt={},we(),Rt="sunday"},hr=function(t){Yt=t},mr=function(){return Yt},kr=function(t){Lt=t},yr=function(){return Lt},gr=function(t){Ft=t},pr=function(){return Ft},vr=function(t){Z=t},Tr=function(){ft=!0},xr=function(){return ft},br=function(){Pt=!0},wr=function(){return Pt},_r=function(t){Ot=t},Dr=function(){return Ot},Cr=function(){return Z},Sr=function(t){ut=t.toLowerCase().split(/[\s,]+/)},Er=function(){return ut},Mr=function(t){dt=t.toLowerCase().split(/[\s,]+/)},Ar=function(){return dt},Ir=function(){return Wt},Yr=function(t){st=t,Vt.push(t)},Lr=function(){return Vt},Fr=function(){let t=$t();const e=10;let r=0;for(;!t&&r<e;)t=$t(),r++;return xt=F,xt},ie=function(t,e,r,n){return n.includes(t.format(e.trim()))?!1:t.isoWeekday()>=6&&r.includes("weekends")||r.includes(t.format("dddd").toLowerCase())?!0:r.includes(t.format(e.trim()))},Wr=function(t){Rt=t},Vr=function(){return Rt},se=function(t,e,r,n){if(!r.length||t.manualEndTime)return;let i;t.startTime instanceof Date?i=B(t.startTime):i=B(t.startTime,e,!0),i=i.add(1,"d");let o;t.endTime instanceof Date?o=B(t.endTime):o=B(t.endTime,e,!0);const[c,g]=Or(i,o,e,r,n);t.endTime=c.toDate(),t.renderEndTime=g},Or=function(t,e,r,n,i){let o=!1,c=null;const g=e.add(1e4,"d");for(;t<=e;){if(o||(c=e.toDate()),o=ie(t,r,n,i),o&&(e=e.add(1,"d"),e>g))throw new Error("Failed to find a valid date that was not excluded by `excludes` after 10,000 iterations.");t=t.add(1,"d")}return[e,c]},At=function(t,e,r){r=r.trim();const i=/^after\s+(?<ids>[\d\w- ]+)/.exec(r);if(i!==null){let c=null;for(const m of i.groups.ids.split(" ")){let x=et(m);x!==void 0&&(!c||x.endTime>c.endTime)&&(c=x)}if(c)return c.endTime;const g=new Date;return g.setHours(0,0,0,0),g}let o=B(r,e.trim(),!0);if(o.isValid())return o.toDate();{Tt.debug("Invalid date:"+r),Tt.debug("With date format:"+e.trim());const c=new Date(r);if(c===void 0||isNaN(c.getTime())||c.getFullYear()<-1e4||c.getFullYear()>1e4)throw new Error("Invalid date:"+r);return c}},ae=function(t){const e=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(t.trim());return e!==null?[Number.parseFloat(e[1]),e[2]]:[NaN,"ms"]},oe=function(t,e,r,n=!1){r=r.trim();const o=/^until\s+(?<ids>[\d\w- ]+)/.exec(r);if(o!==null){let v=null;for(const _ of o.groups.ids.split(" ")){let k=et(_);k!==void 0&&(!v||k.startTime<v.startTime)&&(v=k)}if(v)return v.startTime;const S=new Date;return S.setHours(0,0,0,0),S}let c=B(r,e.trim(),!0);if(c.isValid())return n&&(c=c.add(1,"d")),c.toDate();let g=B(t);const[m,x]=ae(r);if(!Number.isNaN(m)){const v=g.add(m,x);v.isValid()&&(g=v)}return g.toDate()};let pt=0;const it=function(t){return t===void 0?(pt=pt+1,"task"+pt):t},zr=function(t,e){let r;e.substr(0,1)===":"?r=e.substr(1,e.length):r=e;const n=r.split(","),i={};de(n,i,ne);for(let c=0;c<n.length;c++)n[c]=n[c].trim();let o="";switch(n.length){case 1:i.id=it(),i.startTime=t.endTime,o=n[0];break;case 2:i.id=it(),i.startTime=At(void 0,Z,n[0]),o=n[1];break;case 3:i.id=it(n[0]),i.startTime=At(void 0,Z,n[1]),o=n[2];break}return o&&(i.endTime=oe(i.startTime,Z,o,ft),i.manualEndTime=B(o,"YYYY-MM-DD",!0).isValid(),se(i,Z,dt,ut)),i},Pr=function(t,e){let r;e.substr(0,1)===":"?r=e.substr(1,e.length):r=e;const n=r.split(","),i={};de(n,i,ne);for(let o=0;o<n.length;o++)n[o]=n[o].trim();switch(n.length){case 1:i.id=it(),i.startTime={type:"prevTaskEnd",id:t},i.endTime={data:n[0]};break;case 2:i.id=it(),i.startTime={type:"getStartDate",startData:n[0]},i.endTime={data:n[1]};break;case 3:i.id=it(n[0]),i.startTime={type:"getStartDate",startData:n[1]},i.endTime={data:n[2]};break}return i};let It,vt,F=[];const ce={},Rr=function(t,e){const r={section:st,type:st,processed:!1,manualEndTime:!1,renderEndTime:null,raw:{data:e},task:t,classes:[]},n=Pr(vt,e);r.raw.startTime=n.startTime,r.raw.endTime=n.endTime,r.id=n.id,r.prevTaskId=vt,r.active=n.active,r.done=n.done,r.crit=n.crit,r.milestone=n.milestone,r.order=Mt,Mt++;const i=F.push(r);vt=r.id,ce[r.id]=i-1},et=function(t){const e=ce[t];return F[e]},Br=function(t,e){const r={section:st,type:st,description:t,task:t,classes:[]},n=zr(It,e);r.startTime=n.startTime,r.endTime=n.endTime,r.id=n.id,r.active=n.active,r.done=n.done,r.crit=n.crit,r.milestone=n.milestone,It=r,xt.push(r)},$t=function(){const t=function(r){const n=F[r];let i="";switch(F[r].raw.startTime.type){case"prevTaskEnd":{const o=et(n.prevTaskId);n.startTime=o.endTime;break}case"getStartDate":i=At(void 0,Z,F[r].raw.startTime.startData),i&&(F[r].startTime=i);break}return F[r].startTime&&(F[r].endTime=oe(F[r].startTime,Z,F[r].raw.endTime.data,ft),F[r].endTime&&(F[r].processed=!0,F[r].manualEndTime=B(F[r].raw.endTime.data,"YYYY-MM-DD",!0).isValid(),se(F[r],Z,dt,ut))),F[r].processed};let e=!0;for(const[r,n]of F.entries())t(r),e=e&&n.processed;return e},Nr=function(t,e){let r=e;nt().securityLevel!=="loose"&&(r=be(e)),t.split(",").forEach(function(n){et(n)!==void 0&&(ue(n,()=>{window.open(r,"_self")}),Wt[n]=r)}),le(t,"clickable")},le=function(t,e){t.split(",").forEach(function(r){let n=et(r);n!==void 0&&n.classes.push(e)})},Hr=function(t,e,r){if(nt().securityLevel!=="loose"||e===void 0)return;let n=[];if(typeof r=="string"){n=r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let o=0;o<n.length;o++){let c=n[o].trim();c.charAt(0)==='"'&&c.charAt(c.length-1)==='"'&&(c=c.substr(1,c.length-2)),n[o]=c}}n.length===0&&n.push(t),et(t)!==void 0&&ue(t,()=>{_e.runFunc(e,...n)})},ue=function(t,e){zt.push(function(){const r=document.querySelector(`[id="${t}"]`);r!==null&&r.addEventListener("click",function(){e()})},function(){const r=document.querySelector(`[id="${t}-text"]`);r!==null&&r.addEventListener("click",function(){e()})})},Xr=function(t,e,r){t.split(",").forEach(function(n){Hr(n,e,r)}),le(t,"clickable")},Gr=function(t){zt.forEach(function(e){e(t)})},Ur={getConfig:()=>nt().gantt,clear:fr,setDateFormat:vr,getDateFormat:Cr,enableInclusiveEndDates:Tr,endDatesAreInclusive:xr,enableTopAxis:br,topAxisEnabled:wr,setAxisFormat:hr,getAxisFormat:mr,setTickInterval:kr,getTickInterval:yr,setTodayMarker:gr,getTodayMarker:pr,setAccTitle:ve,getAccTitle:pe,setDiagramTitle:ge,getDiagramTitle:ye,setDisplayMode:_r,getDisplayMode:Dr,setAccDescription:ke,getAccDescription:me,addSection:Yr,getSections:Lr,getTasks:Fr,addTask:Rr,findTaskById:et,addTaskOrg:Br,setIncludes:Sr,getIncludes:Er,setExcludes:Mr,getExcludes:Ar,setClickEvent:Xr,setLink:Nr,getLinks:Ir,bindFunctions:Gr,parseDuration:ae,isInvalidDate:ie,setWeekday:Wr,getWeekday:Vr};function de(t,e,r){let n=!0;for(;n;)n=!1,r.forEach(function(i){const o="^\\s*"+i+"\\s*$",c=new RegExp(o);t[0].match(c)&&(e[i]=!0,t.shift(1),n=!0)})}const qr=function(){Tt.debug("Something is calling, setConf, remove the call")},te={monday:Ve,tuesday:We,wednesday:Fe,thursday:Le,friday:Ye,saturday:Ie,sunday:Ae},jr=(t,e)=>{let r=[...t].map(()=>-1/0),n=[...t].sort((o,c)=>o.startTime-c.startTime||o.order-c.order),i=0;for(const o of n)for(let c=0;c<r.length;c++)if(o.startTime>=r[c]){r[c]=o.endTime,o.order=c+e,c>i&&(i=c);break}return i};let K;const Zr=function(t,e,r,n){const i=nt().gantt,o=nt().securityLevel;let c;o==="sandbox"&&(c=kt("#i"+e));const g=o==="sandbox"?kt(c.nodes()[0].contentDocument.body):kt("body"),m=o==="sandbox"?c.nodes()[0].contentDocument:document,x=m.getElementById(e);K=x.parentElement.offsetWidth,K===void 0&&(K=1200),i.useWidth!==void 0&&(K=i.useWidth);const v=n.db.getTasks();let S=[];for(const y of v)S.push(y.type);S=W(S);const _={};let k=2*i.topPadding;if(n.db.getDisplayMode()==="compact"||i.displayMode==="compact"){const y={};for(const w of v)y[w.section]===void 0?y[w.section]=[w]:y[w.section].push(w);let C=0;for(const w of Object.keys(y)){const p=jr(y[w],C)+1;C+=p,k+=p*(i.barHeight+i.barGap),_[w]=p}}else{k+=v.length*(i.barHeight+i.barGap);for(const y of S)_[y]=v.filter(C=>C.type===y).length}x.setAttribute("viewBox","0 0 "+K+" "+k);const L=g.select(`[id="${e}"]`),D=De().domain([Ce(v,function(y){return y.startTime}),Se(v,function(y){return y.endTime})]).rangeRound([0,K-i.leftPadding-i.rightPadding]);function O(y,C){const w=y.startTime,p=C.startTime;let a=0;return w>p?a=1:w<p&&(a=-1),a}v.sort(O),P(v,K,k),Te(L,k,K,i.useMaxWidth),L.append("text").text(n.db.getDiagramTitle()).attr("x",K/2).attr("y",i.titleTopMargin).attr("class","titleText");function P(y,C,w){const p=i.barHeight,a=p+i.barGap,f=i.topPadding,h=i.leftPadding,l=Ee().domain([0,S.length]).range(["#00B9FA","#F95002"]).interpolate(Me);N(a,f,h,C,w,y,n.db.getExcludes(),n.db.getIncludes()),U(h,f,C,w),G(y,a,f,h,p,l,C),H(a,f),R(h,f,C,w)}function G(y,C,w,p,a,f,h){const T=[...new Set(y.map(u=>u.order))].map(u=>y.find(b=>b.order===u));L.append("g").selectAll("rect").data(T).enter().append("rect").attr("x",0).attr("y",function(u,b){return b=u.order,b*C+w-2}).attr("width",function(){return h-i.rightPadding/2}).attr("height",C).attr("class",function(u){for(const[b,Y]of S.entries())if(u.type===Y)return"section section"+b%i.numberSectionStyles;return"section section0"});const s=L.append("g").selectAll("rect").data(y).enter(),V=n.db.getLinks();if(s.append("rect").attr("id",function(u){return u.id}).attr("rx",3).attr("ry",3).attr("x",function(u){return u.milestone?D(u.startTime)+p+.5*(D(u.endTime)-D(u.startTime))-.5*a:D(u.startTime)+p}).attr("y",function(u,b){return b=u.order,b*C+w}).attr("width",function(u){return u.milestone?a:D(u.renderEndTime||u.endTime)-D(u.startTime)}).attr("height",a).attr("transform-origin",function(u,b){return b=u.order,(D(u.startTime)+p+.5*(D(u.endTime)-D(u.startTime))).toString()+"px "+(b*C+w+.5*a).toString()+"px"}).attr("class",function(u){const b="task";let Y="";u.classes.length>0&&(Y=u.classes.join(" "));let M=0;for(const[E,I]of S.entries())u.type===I&&(M=E%i.numberSectionStyles);let A="";return u.active?u.crit?A+=" activeCrit":A=" active":u.done?u.crit?A=" doneCrit":A=" done":u.crit&&(A+=" crit"),A.length===0&&(A=" task"),u.milestone&&(A=" milestone "+A),A+=M,A+=" "+Y,b+A}),s.append("text").attr("id",function(u){return u.id+"-text"}).text(function(u){return u.task}).attr("font-size",i.fontSize).attr("x",function(u){let b=D(u.startTime),Y=D(u.renderEndTime||u.endTime);u.milestone&&(b+=.5*(D(u.endTime)-D(u.startTime))-.5*a),u.milestone&&(Y=b+a);const M=this.getBBox().width;return M>Y-b?Y+M+1.5*i.leftPadding>h?b+p-5:Y+p+5:(Y-b)/2+b+p}).attr("y",function(u,b){return b=u.order,b*C+i.barHeight/2+(i.fontSize/2-2)+w}).attr("text-height",a).attr("class",function(u){const b=D(u.startTime);let Y=D(u.endTime);u.milestone&&(Y=b+a);const M=this.getBBox().width;let A="";u.classes.length>0&&(A=u.classes.join(" "));let E=0;for(const[at,ot]of S.entries())u.type===ot&&(E=at%i.numberSectionStyles);let I="";return u.active&&(u.crit?I="activeCritText"+E:I="activeText"+E),u.done?u.crit?I=I+" doneCritText"+E:I=I+" doneText"+E:u.crit&&(I=I+" critText"+E),u.milestone&&(I+=" milestoneText"),M>Y-b?Y+M+1.5*i.leftPadding>h?A+" taskTextOutsideLeft taskTextOutside"+E+" "+I:A+" taskTextOutsideRight taskTextOutside"+E+" "+I+" width-"+M:A+" taskText taskText"+E+" "+I+" width-"+M}),nt().securityLevel==="sandbox"){let u;u=kt("#i"+e);const b=u.nodes()[0].contentDocument;s.filter(function(Y){return V[Y.id]!==void 0}).each(function(Y){var M=b.querySelector("#"+Y.id),A=b.querySelector("#"+Y.id+"-text");const E=M.parentNode;var I=b.createElement("a");I.setAttribute("xlink:href",V[Y.id]),I.setAttribute("target","_top"),E.appendChild(I),I.appendChild(M),I.appendChild(A)})}}function N(y,C,w,p,a,f,h,l){if(h.length===0&&l.length===0)return;let T,s;for(const{startTime:M,endTime:A}of f)(T===void 0||M<T)&&(T=M),(s===void 0||A>s)&&(s=A);if(!T||!s)return;if(B(s).diff(B(T),"year")>5){Tt.warn("The difference between the min and max time is more than 5 years. This will cause performance issues. Skipping drawing exclude days.");return}const V=n.db.getDateFormat(),d=[];let u=null,b=B(T);for(;b.valueOf()<=s;)n.db.isInvalidDate(b,V,h,l)?u?u.end=b:u={start:b,end:b}:u&&(d.push(u),u=null),b=b.add(1,"d");L.append("g").selectAll("rect").data(d).enter().append("rect").attr("id",function(M){return"exclude-"+M.start.format("YYYY-MM-DD")}).attr("x",function(M){return D(M.start)+w}).attr("y",i.gridLineStartPadding).attr("width",function(M){const A=M.end.add(1,"day");return D(A)-D(M.start)}).attr("height",a-C-i.gridLineStartPadding).attr("transform-origin",function(M,A){return(D(M.start)+w+.5*(D(M.end)-D(M.start))).toString()+"px "+(A*y+.5*a).toString()+"px"}).attr("class","exclude-range")}function U(y,C,w,p){let a=Xe(D).tickSize(-p+C+i.gridLineStartPadding).tickFormat(Nt(n.db.getAxisFormat()||i.axisFormat||"%Y-%m-%d"));const h=/^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/.exec(n.db.getTickInterval()||i.tickInterval);if(h!==null){const l=h[1],T=h[2],s=n.db.getWeekday()||i.weekday;switch(T){case"millisecond":a.ticks(jt.every(l));break;case"second":a.ticks(qt.every(l));break;case"minute":a.ticks(Ut.every(l));break;case"hour":a.ticks(Gt.every(l));break;case"day":a.ticks(Xt.every(l));break;case"week":a.ticks(te[s].every(l));break;case"month":a.ticks(Ht.every(l));break}}if(L.append("g").attr("class","grid").attr("transform","translate("+y+", "+(p-50)+")").call(a).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10).attr("dy","1em"),n.db.topAxisEnabled()||i.topAxis){let l=He(D).tickSize(-p+C+i.gridLineStartPadding).tickFormat(Nt(n.db.getAxisFormat()||i.axisFormat||"%Y-%m-%d"));if(h!==null){const T=h[1],s=h[2],V=n.db.getWeekday()||i.weekday;switch(s){case"millisecond":l.ticks(jt.every(T));break;case"second":l.ticks(qt.every(T));break;case"minute":l.ticks(Ut.every(T));break;case"hour":l.ticks(Gt.every(T));break;case"day":l.ticks(Xt.every(T));break;case"week":l.ticks(te[V].every(T));break;case"month":l.ticks(Ht.every(T));break}}L.append("g").attr("class","grid").attr("transform","translate("+y+", "+C+")").call(l).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10)}}function H(y,C){let w=0;const p=Object.keys(_).map(a=>[a,_[a]]);L.append("g").selectAll("text").data(p).enter().append(function(a){const f=a[0].split(xe.lineBreakRegex),h=-(f.length-1)/2,l=m.createElementNS("http://www.w3.org/2000/svg","text");l.setAttribute("dy",h+"em");for(const[T,s]of f.entries()){const V=m.createElementNS("http://www.w3.org/2000/svg","tspan");V.setAttribute("alignment-baseline","central"),V.setAttribute("x","10"),T>0&&V.setAttribute("dy","1em"),V.textContent=s,l.appendChild(V)}return l}).attr("x",10).attr("y",function(a,f){if(f>0)for(let h=0;h<f;h++)return w+=p[f-1][1],a[1]*y/2+w*y+C;else return a[1]*y/2+C}).attr("font-size",i.sectionFontSize).attr("class",function(a){for(const[f,h]of S.entries())if(a[0]===h)return"sectionTitle sectionTitle"+f%i.numberSectionStyles;return"sectionTitle"})}function R(y,C,w,p){const a=n.db.getTodayMarker();if(a==="off")return;const f=L.append("g").attr("class","today"),h=new Date,l=f.append("line");l.attr("x1",D(h)+y).attr("x2",D(h)+y).attr("y1",i.titleTopMargin).attr("y2",p-i.titleTopMargin).attr("class","today"),a!==""&&l.attr("style",a.replace(/,/g,";"))}function W(y){const C={},w=[];for(let p=0,a=y.length;p<a;++p)Object.prototype.hasOwnProperty.call(C,y[p])||(C[y[p]]=!0,w.push(y[p]));return w}},Qr={setConf:qr,draw:Zr},Jr=t=>`
  .mermaid-main-font {
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }

  .exclude-range {
    fill: ${t.excludeBkgColor};
  }

  .section {
    stroke: none;
    opacity: 0.2;
  }

  .section0 {
    fill: ${t.sectionBkgColor};
  }

  .section2 {
    fill: ${t.sectionBkgColor2};
  }

  .section1,
  .section3 {
    fill: ${t.altSectionBkgColor};
    opacity: 0.2;
  }

  .sectionTitle0 {
    fill: ${t.titleColor};
  }

  .sectionTitle1 {
    fill: ${t.titleColor};
  }

  .sectionTitle2 {
    fill: ${t.titleColor};
  }

  .sectionTitle3 {
    fill: ${t.titleColor};
  }

  .sectionTitle {
    text-anchor: start;
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }


  /* Grid and axis */

  .grid .tick {
    stroke: ${t.gridColor};
    opacity: 0.8;
    shape-rendering: crispEdges;
  }

  .grid .tick text {
    font-family: ${t.fontFamily};
    fill: ${t.textColor};
  }

  .grid path {
    stroke-width: 0;
  }


  /* Today line */

  .today {
    fill: none;
    stroke: ${t.todayLineColor};
    stroke-width: 2px;
  }


  /* Task styling */

  /* Default task */

  .task {
    stroke-width: 2;
  }

  .taskText {
    text-anchor: middle;
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }

  .taskTextOutsideRight {
    fill: ${t.taskTextDarkColor};
    text-anchor: start;
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }

  .taskTextOutsideLeft {
    fill: ${t.taskTextDarkColor};
    text-anchor: end;
  }


  /* Special case clickable */

  .task.clickable {
    cursor: pointer;
  }

  .taskText.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideLeft.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideRight.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }


  /* Specific task settings for the sections*/

  .taskText0,
  .taskText1,
  .taskText2,
  .taskText3 {
    fill: ${t.taskTextColor};
  }

  .task0,
  .task1,
  .task2,
  .task3 {
    fill: ${t.taskBkgColor};
    stroke: ${t.taskBorderColor};
  }

  .taskTextOutside0,
  .taskTextOutside2
  {
    fill: ${t.taskTextOutsideColor};
  }

  .taskTextOutside1,
  .taskTextOutside3 {
    fill: ${t.taskTextOutsideColor};
  }


  /* Active task */

  .active0,
  .active1,
  .active2,
  .active3 {
    fill: ${t.activeTaskBkgColor};
    stroke: ${t.activeTaskBorderColor};
  }

  .activeText0,
  .activeText1,
  .activeText2,
  .activeText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Completed task */

  .done0,
  .done1,
  .done2,
  .done3 {
    stroke: ${t.doneTaskBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
  }

  .doneText0,
  .doneText1,
  .doneText2,
  .doneText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Tasks on the critical line */

  .crit0,
  .crit1,
  .crit2,
  .crit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.critBkgColor};
    stroke-width: 2;
  }

  .activeCrit0,
  .activeCrit1,
  .activeCrit2,
  .activeCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.activeTaskBkgColor};
    stroke-width: 2;
  }

  .doneCrit0,
  .doneCrit1,
  .doneCrit2,
  .doneCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
    cursor: pointer;
    shape-rendering: crispEdges;
  }

  .milestone {
    transform: rotate(45deg) scale(0.8,0.8);
  }

  .milestoneText {
    font-style: italic;
  }
  .doneCritText0,
  .doneCritText1,
  .doneCritText2,
  .doneCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .activeCritText0,
  .activeCritText1,
  .activeCritText2,
  .activeCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .titleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${t.titleColor||t.textColor};
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }
`,Kr=Jr,nn={parser:dr,db:Ur,renderer:Qr,styles:Kr};export{nn as diagram};
