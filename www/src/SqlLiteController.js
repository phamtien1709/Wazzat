import MainData from "./model/MainData.js";
import DataUser from "./model/user/DataUser.js";
import PlayingLogic from "./controller/PlayingLogic.js";
import UserPlaylist from "./model/user/UserPlaylist.js";
import SocketController from "./controller/SocketController.js";
import UserGenres from "./model/user/UserGenres.js";

export default class SqlLiteController {
    constructor() {
        this.zoneName = "";
        this.event = {
            get_config_data_complete: new Phaser.Signal(),
            reset_data_shop_playlist_complete: new Phaser.Signal(),
            insert_data_shop_playlist_complete: new Phaser.Signal(),
            update_playlist_reload_at_complete: new Phaser.Signal(),
            reset_data_user_playlist_mapping_complete: new Phaser.Signal(),
            insert_data_user_playlist_mapping_complete: new Phaser.Signal(),
            insert_data_playlist_level_setting_complete: new Phaser.Signal(),
            get_data_shop_playlist_complete: new Phaser.Signal(),
            get_data_playlist_complete: new Phaser.Signal(),
            get_data_me_playlist_complete: new Phaser.Signal(),
            get_data_genres_complete: new Phaser.Signal(),
            get_playlist_level_setting_complete: new Phaser.Signal(),
            get_check_vote: new Phaser.Signal(),
            get_messages_complete: new Phaser.Signal(),
            get_user_messages_complete: new Phaser.Signal(),
            get_system_messages_complete: new Phaser.Signal()
        }
        document.addEventListener("deviceready", this.onDeviceReady.bind(this), false);
    }

    onDeviceReady() {
        if (MainData.instance().platform === 'web') {
            this.db = window.openDatabase('wazzat', '1.0', 'Data', 10 * 1024 * 1024);
        }
        else {
            this.db = window.sqlitePlugin.openDatabase(
                {
                    name: 'wazzat.db',
                    location: 'default',
                    androidDatabaseProvider: 'system',
                    androidLockWorkaround: 1
                });
        }
    }

    getConfigData() {
        this.db.transaction(
            (tx) => {
                //tx.executeSql('DROP TABLE IF EXISTS config_data');
                tx.executeSql('CREATE TABLE IF NOT EXISTS config_data ('
                    + "playlist_reload_at text"
                    + ", check_vote text"
                    + ", id integer"
                    + ", stt integer primary key"
                    + ")"
                );

                tx.executeSql(
                    "select * from config_data where id = 0",
                    [],
                    (tx, res) => {
                        console.log("data config");
                        console.log(res);
                        if (res.rows.length > 0) {
                            MainData.instance().playlist_reload_at = res.rows.item(0).playlist_reload_at;
                        } else {
                            tx.executeSql
                                (
                                    "INSERT OR REPLACE INTO config_data ("
                                    + "playlist_reload_at, id, check_vote"
                                    + ")"
                                    + " VALUES " + "(?,?,?)",
                                    ["", 0, ""],
                                    (tx, resInsert) => {
                                        console.log("insert config");
                                        console.log(resInsert);
                                    },
                                    (tx, e) => {
                                        console.log(e);
                                    }
                                );
                            MainData.instance().playlist_reload_at = "";
                        }
                    },
                    (tx, e) => {
                        console.log(e);
                    }
                );
            },
            (e) => {
                console.log(e);
                this.event.get_config_data_complete.dispatch();
            },
            () => {
                this.event.get_config_data_complete.dispatch();
            }
        );
    }

    getCheckVote() {
        this.db.transaction(
            (tx) => {
                tx.executeSql(
                    "select * from config_data where id = 0",
                    [],
                    (tx, res) => {
                        console.log("-----------");
                        console.log(res)
                        if (res.rows.length > 0) {
                            this.event.get_check_vote.dispatch(res.rows.item(0).check_vote);
                        } else {
                            this.event.get_check_vote.dispatch("");
                        }
                    },
                    (tx, e) => {
                        this.event.get_check_vote.dispatch("");
                    }
                );
            }
            ,
            (e) => {
                this.event.get_check_vote.dispatch("");
            },
            () => {
            }
        );
    }
    updateCheckVote(vote) {
        this.db.transaction(
            (tx) => {
                tx.executeSql(
                    "update config_data set check_vote = '" + vote + "' where id = 0",
                    [],
                    (tx, res) => {

                    },
                    (tx, e) => {
                        console.log(e);
                    }
                );
            }
            ,
            (e) => {
                console.log(e);
            },
            () => {
            }
        );
    }

    updatePlaylistReloadAt() {
        this.db.transaction(
            (tx) => {
                tx.executeSql
                    (
                        "UPDATE config_data SET playlist_reload_at = '" + window.RESOURCE.playlist_reload_at +
                        "' WHERE id = 0",
                        [],
                        (tx, res) => {

                        },
                        (tx, e) => {
                            console.log("ERROR: " + e.message);
                            console.log(e);
                        }
                    );
            },
            (e) => {
                this.event.update_playlist_reload_at_complete.dispatch();
            },
            () => {
                this.event.update_playlist_reload_at_complete.dispatch();
            }
        );
    }

    insertTablePlaylistLevelSetting(arrData) {
        this.db.transaction(
            (tx) => {
                this.createTablePlaylistLevelSetting(tx);
                for (let i = 0; i < arrData.length; i++) {
                    let item = arrData[i];
                    tx.executeSql
                        (
                            "INSERT OR REPLACE INTO playlist_level_setting ("
                            + "level, exp_score, id, song_number"
                            + ")"
                            + " VALUES " + "(?,?,?,?)",
                            [
                                item.level, item.exp_score, item.id, item.song_number
                            ],
                            (tx, res) => {
                            },
                            (tx, e) => {
                            }
                        );
                }
            },
            (e) => {
                this.event.insert_data_playlist_level_setting_complete.dispatch();
            },
            () => {
                this.event.insert_data_playlist_level_setting_complete.dispatch();
            });
    }

    getPlaylistLevelSetting() {
        this.db.transaction(
            (tx) => {
                tx.executeSql(
                    "select * from playlist_level_setting", [],
                    (tx, res) => {
                        let arr = [];
                        for (let i = 0; i < res.rows.length; i++) {
                            arr.push(res.rows.item(i));
                        }
                        this.event.get_playlist_level_setting_complete.dispatch(arr);
                    },
                    (tx, e) => {
                        this.event.get_playlist_level_setting_complete.dispatch([]);
                    }
                );
            },
            (e) => {
                this.event.get_playlist_level_setting_complete.dispatch([]);
            },
            () => {
            }
        );
    }

    createTablePlaylistLevelSetting(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS playlist_level_setting ('
            + "level integer"
            + ", exp_score integer"
            + ", song_number integer"
            + ", id integer primary key"
            + ")"
        );
    }

    resetTableShopPlaylist() {
        this.db.transaction(
            (tx) => {
                tx.executeSql("DROP TABLE IF EXISTS playlist_level_setting");
                tx.executeSql("DROP TABLE IF EXISTS shop_playlist");
                tx.executeSql("DROP TABLE IF EXISTS genres");
                tx.executeSql("DROP TABLE IF EXISTS user_playlist_mappings");
                tx.executeSql("DROP TABLE IF EXISTS messages");
                tx.executeSql("DROP TABLE IF EXISTS system_messages");
                tx.executeSql("DROP TABLE IF EXISTS user_messages");

                this.createTableShopPlaylist(tx);
                this.createTableGenres(tx);
                this.createTablePlaylistLevelSetting(tx);
                this.createTableMessages(tx);
            },
            (e) => {
                this.event.reset_data_shop_playlist_complete.dispatch();
            },
            () => {
                this.event.reset_data_shop_playlist_complete.dispatch();
            });
    }

    createTableShopPlaylist(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS shop_playlist ('
            + "is_highlight integer"
            + ", used_times integer"
            + ", thumb text"
            + ", created text"
            + ", is_owner integer"
            + ", description text"
            + ", active integer"
            + ", is_default integer"
            + ", genre_id integer"
            + ", price integer"
            + ", is_general integer"
            + ", name text"
            + ", purchased_count integer"
            + ", playlist_id integer"
            + ", vip integer"
            + ", is_solo_mode integer"
            + ", updated text"
            + ", country_id integer"
            + ", region text"
            + ", id integer primary key"
            + ")"
        );
    }

    createTableGenres(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS genres ('
            + "parent integer"
            + ", code text"
            + ", genre text"
            + ", created text"
            + ", active integer"
            + ", genres_id integer"
            + ", priority integer"
            + ", region text"
            + ", id integer primary key"
            + ", zone text"
            + ")"
        );
    }

    insertDataShopPlaylist(objData) {
        this.db.transaction(
            (tx) => {
                this.createTableShopPlaylist(tx);
                console.log(objData);

                for (let i = 0; i < objData.playlists.length; i++) {
                    let item = objData.playlists[i];
                    tx.executeSql
                        (
                            "INSERT OR REPLACE INTO shop_playlist ("
                            + "id, is_highlight, used_times, thumb, created, is_owner,"
                            + " description, active, is_default, genre_id, price,"
                            + " is_general, name, purchased_count, playlist_id, vip, is_solo_mode, updated, country_id, region"
                            + ")"
                            + " VALUES " + "(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                            [
                                item.id, item.is_highlight, item.used_times, item.thumb, item.created, item.is_owner,
                                item.description, item.active, item.is_default, item.genre_id, item.price,
                                item.is_general, item.name, item.purchased_count, item.id, item.vip, item.is_solo_mode,
                                item.updated, item.country_id, item.region
                            ],
                            (tx, res) => {
                                // console.log("thanh cong")
                            },
                            (tx, e) => {
                                console.log("ERROR: " + e.message);
                            }
                        );
                }

                this.createTableGenres(tx);

                for (let i = 0; i < objData.genres.length; i++) {
                    let item = objData.genres[i];
                    tx.executeSql
                        (
                            "INSERT OR REPLACE INTO genres ("
                            + "id, parent, code, genre, active, genres_id, priority, region, zone"
                            + ")"
                            + " VALUES " + "(?,?,?,?,?,?,?,?, ?)",
                            [
                                item.id, item.parent, item.code, item.genre, item.active, item.id,
                                item.priority, item.region, this.zoneName
                            ],
                            (tx, res) => {
                                // console.log("thanh cong")
                            },
                            (tx, e) => {
                                console.log("ERROR: " + e.message);
                            }
                        );
                }
            },
            (e) => {
                this.event.insert_data_shop_playlist_complete.dispatch();
            },
            () => {
                this.event.insert_data_shop_playlist_complete.dispatch();
            }
        );
    }

    getDataShop() {
        this.db.transaction(
            (tx) => {

                tx.executeSql(
                    "select * from shop_playlist where playlist_id not in (select playlist_id from user_playlist_mappings" +
                    " where user_playlist_mappings.user_id = " + SocketController.instance().dataMySeft.user_id +
                    " and user_playlist_mappings.zone = '" + this.zoneName + "'" +
                    ")", [],
                    (tx, res) => {

                        let arr = [];
                        for (let i = 0; i < res.rows.length; i++) {
                            arr.push(this.setDataUserPlaylist(res.rows.item(i)));
                        }
                        this.event.get_data_shop_playlist_complete.dispatch(arr);
                    },
                    (tx, e) => {
                        console.log(e);
                        this.event.get_data_shop_playlist_complete.dispatch([]);
                    }
                );
            },
            (e) => {
                console.log(e);
                this.event.get_data_shop_playlist_complete.dispatch([]);
            },
            () => {
            }
        );
    }


    setDataUserPlaylist(dataDb, isGetUser = false) {
        let item = new UserPlaylist();
        item.is_highlight = dataDb.is_highlight;
        item.used_times = dataDb.used_times;
        item.thumb = dataDb.thumb;
        item.created = parseInt(dataDb.created);
        item.is_owner = dataDb.is_owner;
        item.description = dataDb.description;
        item.active = dataDb.active;
        item.is_default = dataDb.is_default;
        item.genre_id = dataDb.genre_id;
        item.price = dataDb.price;
        item.is_general = dataDb.is_general;
        item.name = dataDb.name;
        item.purchased_count = dataDb.purchased_count;
        item.id = dataDb.playlist_id;
        item.vipInt = dataDb.vip;
        if (item.vipInt === 0) {
            item.vip = false;
        } else {
            item.vip = true;
        }
        item.is_solo_mode = dataDb.is_solo_mode;
        item.updated = parseInt(dataDb.updated);
        item.country_id = dataDb.country_id;
        item.region = dataDb.region;
        if (isGetUser === true) {
            item.user.user_id = dataDb.user_id;
            item.user.level = dataDb.level;
            item.user.playlist_id = dataDb.playlist_id;
            item.user.exp_score = dataDb.exp_score;
            item.user.active = dataDb.active;
            item.user.id = dataDb.id;
            item.user.current_level_score = dataDb.current_level_score;
            item.user.next_level_score = dataDb.next_level_score;
            item.user.updated = parseInt(dataDb.updated);
            item.user.master = dataDb.master;
            item.user.active = dataDb.active;
        }

        return item;
    }

    getPlaylistMe(isSuggest = false) {
        this.db.transaction(
            (tx) => {
                console.log("this.zoneName : " + this.zoneName);
                tx.executeSql(
                    "select * from shop_playlist" +
                    " inner join user_playlist_mappings on shop_playlist.playlist_id = user_playlist_mappings.playlist_id" +
                    " WHERE user_playlist_mappings.user_id = " + SocketController.instance().dataMySeft.user_id +
                    " and user_playlist_mappings.zone = '" + this.zoneName + "'",
                    [],
                    (tx, res) => {

                        console.log(res);

                        let arrPlaylist = [];
                        for (let i = 0; i < res.rows.length; i++) {
                            arrPlaylist.push(this.setDataUserPlaylist(res.rows.item(i), true));
                        }

                        if (isSuggest === true) {
                            tx.executeSql(
                                "select * from shop_playlist where playlist_id not in (select playlist_id from user_playlist_mappings" +
                                " where user_playlist_mappings.user_id = " + SocketController.instance().dataMySeft.user_id +
                                " and user_playlist_mappings.zone = '" + this.zoneName + "'" +
                                ")", [],
                                (tx, resug) => {
                                    if (resug.rows.length > 0) {
                                        let randomId = PlayingLogic.instance().randomNumber(0, resug.rows.length - 1);
                                        this.event.get_data_me_playlist_complete.dispatch({
                                            playlist: arrPlaylist,
                                            suggestion_playlist: this.setDataUserPlaylist(resug.rows.item(randomId))
                                            // suggestion_playlist: null
                                        });
                                    } else {
                                        this.event.get_data_me_playlist_complete.dispatch({
                                            playlist: arrPlaylist,
                                            suggestion_playlist: null
                                        });
                                    }
                                },
                                (tx, e) => {
                                    console.log(e);
                                    this.event.get_data_me_playlist_complete.dispatch({
                                        playlist: arrPlaylist,
                                        suggestion_playlist: null
                                    });
                                }
                            );
                        } else {
                            this.event.get_data_me_playlist_complete.dispatch(arrPlaylist);
                        }
                    },
                    (tx, e) => {
                        console.log(e);
                        this.event.get_data_me_playlist_complete.dispatch([]);
                    }
                );
            },
            (e) => {
                console.log(e);
                this.event.get_data_me_playlist_complete.dispatch([]);
            },
            () => {
            });
    }

    getPlaylistMeByGenres(genre_id, isSuggest = false) {
        this.db.transaction(
            (tx) => {
                tx.executeSql(
                    "select * from shop_playlist" +
                    " inner join user_playlist_mappings on shop_playlist.playlist_id = user_playlist_mappings.playlist_id" +
                    " WHERE user_playlist_mappings.user_id = " + SocketController.instance().dataMySeft.user_id +
                    " and user_playlist_mappings.zone = '" + this.zoneName + "'" +
                    " AND shop_playlist.genre_id = " + genre_id,
                    [],
                    (tx, res) => {
                        console.log("thanh cong");
                        console.log(res);
                        let arrPlaylist = [];
                        for (let i = 0; i < res.rows.length; i++) {
                            arrPlaylist.push(this.setDataUserPlaylist(res.rows.item(i), true));
                        }

                        if (isSuggest === true) {
                            tx.executeSql(
                                "select * from shop_playlist where playlist_id not in (select playlist_id from user_playlist_mappings" +
                                " where user_playlist_mappings.user_id = " + SocketController.instance().dataMySeft.user_id +
                                " and user_playlist_mappings.zone = '" + this.zoneName + "'" +
                                ")", [],
                                (tx, resug) => {
                                    if (resug.rows.length > 0) {
                                        let randomId = PlayingLogic.instance().randomNumber(0, resug.rows.length - 1);
                                        this.event.get_data_me_playlist_complete.dispatch({
                                            playlist: arrPlaylist,
                                            suggestion_playlist: this.setDataUserPlaylist(resug.rows.item(randomId))
                                        });
                                    } else {
                                        let randomId = PlayingLogic.instance().randomNumber(0, resug.rows.length - 1);
                                        this.event.get_data_me_playlist_complete.dispatch({
                                            playlist: arrPlaylist,
                                            suggestion_playlist: null
                                        });
                                    }
                                },
                                (tx, e) => {
                                    this.event.get_data_me_playlist_complete.dispatch({
                                        playlist: arrPlaylist,
                                        suggestion_playlist: null
                                    });
                                }
                            );
                        } else {
                            this.event.get_data_me_playlist_complete.dispatch(arrPlaylist);
                        }
                    },
                    (tx, e) => {
                        this.event.get_data_me_playlist_complete.dispatch([]);
                    }
                );
            },
            (e) => {
                this.event.get_data_me_playlist_complete.dispatch([]);
            },
            () => {
            });
    }

    getQuickplayPlaylistByGenres(genre_id) {
        this.db.transaction(
            (tx) => {
                tx.executeSql(
                    "select * from shop_playlist" +
                    " inner join user_playlist_mappings on shop_playlist.playlist_id = user_playlist_mappings.playlist_id" +
                    " Where shop_playlist.genre_id = " + genre_id +
                    " and user_playlist_mappings.user_id = " + SocketController.instance().dataMySeft.user_id +
                    " and user_playlist_mappings.zone = '" + this.zoneName + "'",
                    [],
                    (tx, res) => {
                        console.log(res);
                        let arrPlaylist = [];
                        for (let i = 0; i < res.rows.length; i++) {
                            arrPlaylist.push(this.setDataUserPlaylist(res.rows.item(i), true));
                        }
                        tx.executeSql(
                            "select * from shop_playlist where playlist_id not in (select playlist_id from user_playlist_mappings" +
                            " where user_playlist_mappings.user_id = " + SocketController.instance().dataMySeft.user_id +
                            " and user_playlist_mappings.zone = '" + this.zoneName + "'" +
                            ")"
                            + " AND shop_playlist.genre_id = " + genre_id, [],
                            (tx, resug) => {
                                for (let i = 0; i < resug.rows.length; i++) {
                                    arrPlaylist.push(this.setDataUserPlaylist(resug.rows.item(i)));
                                }
                                this.event.get_data_me_playlist_complete.dispatch(arrPlaylist);
                            },
                            (tx, e) => {
                                this.event.get_data_me_playlist_complete.dispatch(arrPlaylist);
                            }
                        );

                    },
                    (tx, e) => {
                        this.event.get_data_me_playlist_complete.dispatch([]);
                    }
                );
            },
            (e) => {
                this.event.get_data_me_playlist_complete.dispatch([]);
            },
            () => {
            });
    }

    changeActivePlaylist(playlist_id, activeSend) {
        this.db.transaction(
            (tx) => {
                let sql = "update user_playlist_mappings set active = " + activeSend +
                    " where playlist_id = " + playlist_id +
                    " and user_id = " + SocketController.instance().dataMySeft.user_id +
                    " and zone = '" + this.zoneName + "'";
                console.log(sql);
                tx.executeSql(
                    sql,
                    [],
                    (tx, res) => {
                    },
                    (tx, e) => {
                        console.log(e);
                    }
                );
            },
            (e) => {
                console.log(e);
            },
            () => {
                console.log("thanh cong--------")
            }
        );
    }

    getPlaylistById(arrId, objLevel = null, user_id = null) {
        let arr = [];
        this.db.transaction(
            (tx) => {

                tx.executeSql(
                    "select * from shop_playlist where playlist_id in (" + arrId + ")", [],
                    (tx, res) => {
                        for (let i = 0; i < res.rows.length; i++) {
                            let item = this.setDataUserPlaylist(res.rows.item(i));
                            if (objLevel !== null) {
                                item.user = objLevel[item.id];
                            }
                            if (user_id !== null) {
                                if (user_id === SocketController.instance().dataMySeft.user_id) {
                                    tx.executeSql(
                                        "select * from user_playlist_mappings where playlist_id = " + item.id +
                                        " and zone = '" + this.zoneName + "'" +
                                        " and user_id = " + user_id,
                                        [],
                                        (txt, res_mapping) => {
                                            console.log(res_mapping);
                                            if (res_mapping.rows.length > 0) {
                                                item.user.user_id = res_mapping.rows.item(0).user_id;
                                                item.user.level = res_mapping.rows.item(0).level;
                                                item.user.playlist_id = res_mapping.rows.item(0).playlist_id;
                                                item.user.exp_score = res_mapping.rows.item(0).exp_score;
                                                item.user.active = res_mapping.rows.item(0).active;
                                                item.user.id = res_mapping.rows.item(0).id;
                                                item.user.current_level_score = res_mapping.rows.item(0).current_level_score;
                                                item.user.next_level_score = res_mapping.rows.item(0).next_level_score;
                                                item.user.updated = parseInt(res_mapping.rows.item(0).updated);
                                                item.user.master = res_mapping.rows.item(0).master;
                                                item.user.active = res_mapping.rows.item(0).active;
                                            }
                                        },
                                        (tx, e) => {

                                        }
                                    )
                                }
                            }

                            arr.push(item);
                        }
                    },
                    (tx, e) => {
                        this.event.get_data_playlist_complete.dispatch([]);
                    }
                );

            },
            (e) => {
                this.event.get_data_playlist_complete.dispatch([]);
            },
            () => {
                console.log("du lieu gui di -------");
                console.log(arr)
                if (arr.length > 1) {
                    this.event.get_data_playlist_complete.dispatch(arr)
                } else {
                    this.event.get_data_playlist_complete.dispatch(arr[0])
                }
            });
    }

    getGenresAll() {
        this.db.transaction(
            (tx) => {
                tx.executeSql(
                    "select * from genres where zone ='" + this.zoneName + "'", [],
                    (tx, res) => {
                        console.log(res);
                        let arr = [];
                        for (let i = 0; i < res.rows.length; i++) {
                            let item = new UserGenres();
                            item.parent = res.rows.item(i).parent;
                            item.code = res.rows.item(i).code;
                            item.genre = res.rows.item(i).genre;
                            item.active = res.rows.item(i).active;
                            item.id = res.rows.item(i).genres_id;
                            item.priority = res.rows.item(i).priority;
                            item.region = res.rows.item(i).region;
                            arr.push(item);
                        }
                        this.event.get_data_genres_complete.dispatch(arr);
                    },
                    (tx, e) => {
                        console.log(e);
                        this.event.get_data_genres_complete.dispatch([]);
                    }
                );
            },
            (e) => {
                this.event.get_data_genres_complete.dispatch([]);
            },
            () => {
            }
        );
    }

    resetTableUserPlaylistMappings() {
        this.db.transaction(
            (tx) => {
                // tx.executeSql('DROP TABLE IF EXISTS user_playlist_mappings');
                this.createTableUserPlaylistMappings(tx);
            },
            (e) => {
                this.event.reset_data_user_playlist_mapping_complete.dispatch();
            },
            () => {
                this.event.reset_data_user_playlist_mapping_complete.dispatch();
            });
    }

    insertTableUserPlaylistMappings(arrData, isUpdateTime = false) {
        console.log("insertTableUserPlaylistMappings ");
        console.log(arrData);
        this.db.transaction(
            (tx) => {
                this.createTableUserPlaylistMappings(tx);

                for (let i = 0; i < arrData.length; i++) {
                    let item = arrData[i];
                    tx.executeSql
                        (
                            "INSERT OR REPLACE INTO user_playlist_mappings ("
                            + "id, user_id, level, playlist_id, exp_score, created, active"
                            + ", current_level_score, next_level_score, updated, master, zone"
                            + ")"
                            + " VALUES " + "(?,?,?,?,?,?,?,?,?,?,?,?)",
                            [
                                item.playlist_id, item.user_id, item.level, item.playlist_id, item.exp_score, item.created, item.active,
                                item.current_level_score, item.next_level_score, item.updated, item.master, this.zoneName
                            ],
                            (tx, res) => {
                                console.log(res);
                            },
                            (tx, e) => {
                                console.log(e);
                            }
                        );

                    if (isUpdateTime === true) {
                        this.updatePlaylistTime(tx, item.playlist_id);
                    }
                }
            },
            (e) => {
                console.log(e);
                this.event.insert_data_user_playlist_mapping_complete.dispatch();
            },
            () => {
                this.event.insert_data_user_playlist_mapping_complete.dispatch();
            });
    }

    updateExpPlaylist(playlist_id) {
        this.db.transaction(
            (tx) => {
                //this.createTableUserPlaylistMappings(tx);
                tx.executeSql
                    (
                        "SELECT * FROM user_playlist_mappings WHERE playlist_id =" + playlist_id +
                        " and user_id = " + SocketController.instance().dataMySeft.user_id +
                        " and zone = '" + this.zoneName + "'",
                        [],
                        (tx, res) => {
                            if (res.rows.length > 0) {
                                let data = res.rows.item(0);
                                data.exp_score = data.exp_score + 2;
                                // console.log(data.exp_score);
                                let currentExpLevel = data.exp_score - data.current_level_score;
                                let maxExpLevel = data.next_level_score - data.current_level_score;
                                if (currentExpLevel > maxExpLevel) {
                                    data.level = data.level + 1;
                                    data.current_level_score = data.next_level_score;
                                    if (DataUser.instance().playlist_level_setting[dataPlayList.user.level + 1]) {
                                        data.next_level_score = DataUser.instance().playlist_level_setting[data.level + 1].exp_score;
                                    }
                                }
                                tx.executeSql
                                    (
                                        "UPDATE user_playlist_mappings SET " +
                                        " exp_score = " + data.exp_score +
                                        ", level = " + data.level +
                                        ", current_level_score = " + data.current_level_score +
                                        ", next_level_score = " + data.next_level_score +
                                        ", updated = " + Date.now() +
                                        " WHERE playlist_id =" + playlist_id +
                                        " AND user_id = " + SocketController.instance().dataMySeft.user_id +
                                        " and zone = '" + this.zoneName + "'",
                                        [],
                                        (tx, abc) => {

                                        },
                                        (tx, e) => {

                                        }
                                    );
                            }
                        },
                        (tx, e) => {
                            console.log(e)
                        }
                    );
                this.updatePlaylistTime(tx, playlist_id);
            },
            (e) => {
                console.log(e)
            },
            () => {

            });
    }

    updatePlaylistTime(tx, playlist_id) {
        console.log("playlist_id : " + playlist_id);
        tx.executeSql
            (
                "UPDATE shop_playlist" +
                " SET updated = " + Date.now() +
                " WHERE id = " + playlist_id,
                [],
                (tx, res) => {
                    console.log(res);
                },
                (tx, e) => {
                    console.log(e);
                }
            );
    }

    createTableUserPlaylistMappings(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS user_playlist_mappings ('
            + "user_id integer"
            + ", level integer"
            + ", playlist_id integer"
            + ", exp_score integer"
            + ", created text"
            + ", active integer"
            + ", current_level_score integer"
            + ", next_level_score integer"
            + ", updated text"
            + ", master integer"
            + ", id integer primary key"
            + ", zone text"
            + ")"
        );
    }

    createTableMessages(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS messages ('
            + "is_read integer"
            + ", created_sfs text"
            + ", from_id integer"
            + ", user_id integer"
            + ", to_id integer"
            + ", state text"
            + ", message text"
            + ", updated_sfs text"
            + ", id integer primary key"
            + ", zone text"
            + ")"
            , [], (tx, results) => { }, (err) => { console.log('err') });
    }

    createTableSystemMessages(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS system_messages ('
            + "is_read integer"
            + ", created_sfs text"
            + ", control text"
            + ", title text"
            + ", message text"
            + ", user_id integer"
            + ", message_content_id integer"
            + ", id integer primary key"
            + ", zone text"
            + ")"
            , [], (tx, results) => { console.log('success') }, (err) => { console.log('err') });
    }

    createTableUserMessages(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS user_messages ('
            + 'level integer'
            + ', user_name text'
            + ', user_id integer'
            + ', id integer primary key'
            + ', avatar text'
            + ', vip integer'
            + ', is_online integer'
            + ', zone text'
            + ')'
            , [], (tx, results) => {
            }, (err) => { console.log('err') });
    }
    // SqlLiteController.instance().db.transaction((tx) => tx.executeSql('DROP TABLE IF EXISTS user_messages'))

    getUserMessages(zone, user_id) {
        this.db.transaction(
            (tx) => {
                this.createTableUserMessages(tx);
                tx.executeSql('SELECT * from user_messages WHERE zone=? and user_id=?', [zone, user_id], (tx, results) => {
                    var len = results.rows.length;
                    let users = [];
                    for (i = 0; i < len; i++) {
                        // console.log(results.rows.item(i));
                        let level = results.rows.item(i).level;
                        let id = results.rows.item(i).id;
                        let user_name = results.rows.item(i).user_name;
                        let avatar = results.rows.item(i).avatar;
                        let vip = results.rows.item(i).vip;
                        let is_online = results.rows.item(i).is_online;
                        if (vip === 1) {
                            vip = true;
                        } else {
                            vip = false;
                        }
                        if (is_online === 1) {
                            is_online = false;
                        } else {
                            is_online = false;
                        }
                        users.push({
                            level,
                            user_name,
                            id,
                            avatar,
                            vip,
                            is_online
                        })
                    }
                    this.event.get_user_messages_complete.dispatch(users)
                }, (err) => {
                    console.warn('ERRgetMesseges');
                    console.log(err);
                    this.event.get_user_messages_complete.dispatch(null)
                });
            }
        )
    }

    updateUserMessages(user) {
        this.db.transaction((tx) => {
            this.createTableUserMessages(tx);
            var executeQuery = "INSERT OR REPLACE INTO user_messages (level, user_name, user_id, id, avatar, is_online, vip, zone) VALUES (?,?,?,?,?,?,?,?)";
            if (user.vip === true) {
                user.vip = 1;
            } else {
                user.vip = 0;
            }
            if (user.is_online === true) {
                user.is_online = 1;
            } else {
                user.is_online = 0;
            }
            tx.executeSql(executeQuery, [user.level, user.user_name, user.user_id, user.id, user.avatar, user.is_online, user.vip, user.zone],
                //On Success
                (tx, result) => {
                    // alert('Updated successfully');
                    // console.log("Updated users successfully");
                },
                //On Error
                (error) => { console.log('error user') });
        });
    }

    getMesseges(zone, user_id) {
        this.db.transaction(
            (tx) => {
                // this.createBlank(tx);
                this.createTableMessages(tx);
                tx.executeSql('SELECT * FROM messages WHERE zone=?', [zone], (tx, results) => {
                    // alert('OK?');
                    var len = results.rows.length;
                    let userMessages = [];
                    for (i = 0; i < len; i++) {
                        let is_read = results.rows.item(i).is_read;
                        let created = parseInt(results.rows.item(i).created_sfs);
                        let from = results.rows.item(i).from_id;
                        let id = results.rows.item(i).id;
                        let to = results.rows.item(i).to_id;
                        let state = results.rows.item(i).state;
                        let message = results.rows.item(i).message;
                        let updated = parseInt(results.rows.item(i).updated_sfs);

                        if (from == user_id || to == user_id) {
                            userMessages.push({
                                is_read,
                                created,
                                from,
                                id,
                                to,
                                state,
                                message,
                                updated
                            })
                        }
                    }
                    //
                    userMessages.sort((a, b) => a.id - b.id)
                    this.event.get_messages_complete.dispatch(userMessages);
                }, (err) => {
                    console.warn('ERRgetMesseges');
                    console.log(err);
                    this.event.get_messages_complete.dispatch(null);
                });
            }
        );
    }

    updateNewMessage(mess) {
        this.db.transaction((tx) => {
            this.createTableMessages(tx);
            var executeQuery = "INSERT OR REPLACE INTO messages (is_read, created_sfs, from_id, id, user_id, to_id, state, message, updated_sfs, zone) VALUES (?,?,?,?,?,?,?,?,?,?)";
            tx.executeSql(executeQuery, [mess.is_read, mess.created, mess.from, mess.id, mess.user_id, mess.to, mess.state, mess.message, mess.updated, mess.zone],
                //On Success
                (tx, result) => {
                    // console.log("Updated successfully");
                },
                //On Error
                (error) => { alert('Something went Wrong'); console.log(error) });
        });
    }

    getSystemMessages(zone, user_id) {
        this.db.transaction(
            (tx) => {
                // this.createBlank(tx);
                this.createTableSystemMessages(tx);
                tx.executeSql('SELECT * FROM system_messages WHERE zone=? and user_id=?', [zone, user_id], (tx, results) => {
                    var len = results.rows.length;
                    let sys_messages = [];
                    for (i = 0; i < len; i++) {
                        let is_read = results.rows.item(i).is_read;
                        let created = parseInt(results.rows.item(i).created_sfs);
                        let message_content_id = results.rows.item(i).message_content_id;
                        let control = results.rows.item(i).control;
                        let title = results.rows.item(i).title;
                        let message = results.rows.item(i).message;
                        sys_messages.push({
                            is_read,
                            created,
                            message_content_id,
                            control,
                            title,
                            message
                        })
                    }
                    sys_messages.sort((a, b) => {
                        return a.message_content_id - b.message_content_id
                    });
                    this.event.get_system_messages_complete.dispatch(sys_messages);
                }, (err) => {
                    console.warn('ERRgetMesseges');
                    console.log(err);
                    this.event.get_system_messages_complete.dispatch(null);
                });
            }
        );
    }

    markAsReadMessage(user_id, friend_id) {
        this.db.transaction(
            (tx) => {
                var executeQuery2 = "UPDATE messages SET is_read=? WHERE to_id=? and from_id=?";
                var is_read = 1;
                tx.executeSql(executeQuery2, [is_read, user_id, friend_id], (tx, result) => {
                    console.log("SUCESS UPDATE2");
                }, (err) => { console.log("ERR UPDATE") })
            })
    }

    markAsReadSystemMessage(id, user_id) {
        this.db.transaction(
            (tx) => {
                var executeQuery = "UPDATE system_messages SET is_read=? WHERE message_content_id=? and user_id=?";
                tx.executeSql(executeQuery, [1, id, user_id], (tx, result) => {
                    console.log("SUCESS UPDATE")
                }, (err) => { console.log("ERR UPDATE") })
            })
    }

    updateNewSystemMessage(mess) {
        this.db.transaction((tx) => {
            this.createTableSystemMessages(tx);
            var executeQuery = "INSERT OR REPLACE INTO system_messages (is_read, created_sfs, control, title, message, user_id, message_content_id, zone) VALUES (?,?,?,?,?,?,?,?)";
            tx.executeSql(executeQuery, [mess.is_read, mess.created, mess.control, mess.title, mess.message, mess.user_id, mess.message_content_id, mess.zone],
                //On Success
                (tx, result) => {
                    // alert('Updated successfully');
                    console.log("Updated system successfully");
                },
                //On Error
                (error) => { alert('Something went Wrong'); console.log(error) });
        });
    }

    static instance() {
        if (this.sqlLite) {

        } else {
            this.sqlLite = new SqlLiteController();
        }

        return this.sqlLite;
    }

}