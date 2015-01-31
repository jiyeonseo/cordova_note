function ListController($scope){
    $scope.noteList = [];

    $scope.add = function(){
        var inputValue = $scope.input;
        $scope.input = "";
        dbInsert(inputValue);
//        var note = {
//            "title" : inputValue
//        }
//        $scope.noteList.push(note);
        dbSelect();

    }
    $scope.delete = function(index){
        var id = $scope.noteList[index].id;
//        $scope.noteList.splice(index, 1);
        alert(id);

        dbDelete(id);
    }

    var db;

    function dbConnection(){
        db = window.sqlitePlugin.openDatabase({name: "my.db"});
        db.transaction(function(tx) {
            tx.executeSql('DROP TABLE IF EXISTS note');
            tx.executeSql('CREATE TABLE IF NOT EXISTS note (id integer primary key autoincrement, data text)');
        });

    }

    function dbSelect(){
        db.transaction(function(tx) {
            tx.executeSql("select * from note;", [], function(tx, res) {
                var list = [];
                for(var i=0; i<res.rows.length; i++){
                    var note = {
                        "id" : res.rows.item(i).id,
                        "title" :res.rows.item(i).data
                    }
                    list.push(note);
                }
                $scope.$apply(function(){
                    $scope.noteList = list;
                });

//                console.log("res.rows.length: " + res.rows.length + " -- should be 1");
//                console.log("res.rows.item(0).cnt: " + res.rows.item(0).data + " -- should be 1");
            });
        });

    }

    function dbInsert(data){
        db.transaction(function(tx) {
            tx.executeSql("INSERT INTO note (data) VALUES (?)", [data], function(tx, res) {
                console.log("insertId: " + res.insertId + " -- probably 1");
                console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
//                dbSelect();
            }, function(e) {
                alert("err "+ e.message);
                console.log("ERROR: " + e.message);
            });
        });

    }

    function dbDelete(id){
        db.transaction(function(tx) {
            tx.executeSql("DELETE FROM note WHERE id=?", [id], function(tx, res) {
                console.log("insertId: " + res.insertId + " -- probably 1");
                console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                dbSelect();
            }, function(e) {
                console.log("ERROR: " + e.message);
            });
        });


    }
    var app = {
        // Application Constructor
        initialize: function() {
            this.bindEvents();
        },
        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },
        // deviceready Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedEvent'
        // function, we must explicitly call 'app.receivedEvent(...);'
        onDeviceReady: function() {
            app.receivedEvent('deviceready');
            //

//            navigator.notification.confirm("msg",
//                function (a,b) {
//                    alert(a,b);
//                },
//                "title",["111", "2222"]);

        },
        // Update DOM on a Received Event
        receivedEvent: function(id) {
            dbConnection();
        }
    };

    app.initialize();

}
