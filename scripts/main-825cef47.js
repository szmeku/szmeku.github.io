"use strict";var Facebook={};!function(){var t=localStorage.getItem("facebookAppId"),e=localStorage.getItem("facebookAppSecret"),a="https://graph.facebook.com/oauth/access_token?client_id="+t+"&grant_type=client_credentials&client_secret="+e,o=$.Deferred();localStorage.getItem("tokenWbazie")?o.resolve(localStorage.getItem("tokenWbazie")):o=$.get(a);var s=o.then(function(t){return-1===t.search("=")?t:t.split("=")[1]});Facebook.token=s}(),angular.module("fanpagePosts",["ngAnimate","ngQuickDate","ngCookies","ngTouch","ngSanitize","restangular","ui.router","ui.bootstrap"]).config(["$stateProvider","$urlRouterProvider",function(t,e){e.otherwise("/settings"),t.state("settings",{url:"/settings",templateUrl:"partials/settings.html",controller:"SettingsCtrl"}).state("posts",{url:"/posts",templateUrl:"partials/posts.html",controller:"PostsCtrl",resolve:{token:function(){return Facebook.token.promise()}}})}]).run(["$rootScope",function(t){t.$on("$stateChangeError",function(e,a,o,s,l,n){t.alerts.push({msg:n.responseJSON.error.message,type:"danger"})})}]),angular.module("fanpagePosts").controller("AlertsCtrl",["$scope","$rootScope",function(t,e){t.closeAlert=function(t){e.alerts.splice(t,1)}}]),angular.module("fanpagePosts").controller("PostsCtrl",["$rootScope","$scope","$filter","token",function(t,e,a,o){function s(t){return t.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g,function(t){switch(t){case"\x00":return"\\0";case"\b":return"\\b";case"	":return"\\t";case"":return"\\z";case"\n":return"\\n";case"\r":return"\\r";case'"':case"'":case"\\":case"%":return"\\"+t}})}var l=null;e.limit=50,e.fanpageId=localStorage.getItem("facebookFanpageID"),e.sqlStart=localStorage.getItem("sqlStart"),e.sqlBody=localStorage.getItem("sqlBody"),e.sqlEnd=localStorage.getItem("sqlEnd"),e.updateSql=function(){localStorage.setItem("sqlStart",e.sqlStart),localStorage.setItem("sqlBody",e.sqlBody),localStorage.setItem("sqlEnd",e.sqlEnd),e.sqlResult=e.sqlStart||"",angular.forEach(e.posts,function(t){var a=e.sqlBody||"";angular.forEach(["created_time","message"],function(e){a=a.replace("{{"+e+"}}",s(t[e]||""))}),e.sqlResult+=a}),e.sqlResult+=e.sqlEnd||""},e.loadPosts=function(a){var a=a||"https://graph.facebook.com/v2.1/"+e.fanpageId+"/posts?fields=message&limit="+e.limit+"&access_token="+o,s=$.get(a,function(t){e.posts=t.data,e.previous=t.paging&&t.paging.previous||l,e.next=t.paging&&t.paging.next||l,e.updateSql(),e.$apply(),l=a});s.fail(function(e,a,o){t.alerts.push({type:"danger",msg:e.responseJSON.error.message||o}),t.$apply()})},e.saveFanpageId=function(t){localStorage.setItem("facebookFanpageID",t)}}]),angular.module("fanpagePosts").controller("SettingsCtrl",["$scope","$rootScope",function(t,e){t.appId=localStorage.getItem("facebookAppId"),t.appSecret=localStorage.getItem("facebookAppSecret"),t.saveSettings=function(){localStorage.setItem("facebookAppId",t.appId),localStorage.setItem("facebookAppSecret",t.appSecret),e.alerts.push({msg:"Ustawienia zapisane!",type:"success"})}}]),function(t){try{t=angular.module("fanpagePosts")}catch(e){t=angular.module("fanpagePosts",[])}t.run(["$templateCache",function(t){t.put("partials/main.html",'<div class="container"><h1>sciezka</h1></div>')}])}(),function(t){try{t=angular.module("fanpagePosts")}catch(e){t=angular.module("fanpagePosts",[])}t.run(["$templateCache",function(t){t.put("partials/posts.html",'<div class="form-group"><label>Fanpejcz ID (w adresie fanpaga dluga liczba)</label><input ng-model="fanpageId" class="form-control" type="text"></div><div class="form-group"><label>Limit postów</label><input ng-model="limit" class="form-control" type="text"></div><div class="form-group"><button class="btn btn-large btn-success" ng-click="saveFanpageId(fanpageId); loadPosts()">Załaduj posty</button><button ng-if="next" class="btn btn-large btn-primary" ng-click="loadPosts(next)"><< Załaduj poprzednie posty</button><button ng-if="previous" class="btn btn-large btn-primary" ng-click="loadPosts(previous)">Załaduj następne posty >></button></div><div class="row"><div class="col-sm-6"><table class="table"><tr><th>Post</th><th>Data utworzenia</th></tr><tr ng-repeat="post in posts"><td>{{ post.message }}</td><td>{{ post.created_time | date : \'d/M/yyyy H:m\'}}</td></tr></table></div><div class="col-sm-6"><div class="well"><a target="_blank" href="http://stackoverflow.com/questions/452859/inserting-multiple-rows-in-a-single-sql-query">pomoc</a> jak wstawiać wiersze do bazy</div><div class="form-group"><label>Początek SQL\'a</label><textarea ng-change="updateSql()" ng-model="sqlStart" class="form-control"></textarea></div><div class="form-group"><label>SQL dla każdego postu</label><p class="text-muted">Możesz użyć <code ng-non-bindable="">{{message}} i {{created_time}}</code></p><textarea ng-change="updateSql()" ng-model="sqlBody" class="form-control"></textarea></div><div class="form-group"><label>Koniec SQL\'a</label><textarea ng-change="updateSql()" ng-model="sqlEnd" class="form-control"></textarea></div><hr><div class="form-group"><label>Wynik</label><p class="text-muted">to zapytanie wykonaj sobie pozniej jakos do bazy, np DBeaver\'em</p><textarea ng-model="sqlResult" class="form-control" rows="100">{{sqlBody}}</textarea></div></div></div>')}])}(),function(t){try{t=angular.module("fanpagePosts")}catch(e){t=angular.module("fanpagePosts",[])}t.run(["$templateCache",function(t){t.put("partials/settings.html",'<div class="well">Pod linkiem <a target="_blank" href="https://developers.facebook.com/apps/">https://developers.facebook.com/apps/</a> stwórz appke, w settingsach nadaj jej odpowiednią domenę, platforma website, skopiuj <strong>App ID</strong> i <strong>App Secret</strong>.</div><div class="form-group"><label>App Id</label><input ng-model="appId" class="form-control" type="text"></div><div class="form-group"><label>App Secret</label><input ng-model="appSecret" class="form-control" type="text"></div><div class="form-group"><button class="btn btn-lg btn-primary" ng-click="saveSettings()">Zapisz ustawienia</button></div>')}])}();