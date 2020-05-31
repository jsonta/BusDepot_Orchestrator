const tabMan = require('./table-manager.js');

var checkAllTables = async function(_request, response) {
    var tablesExist =
    {
        brigades: false,
        brigades_timetable: false,
        buses: false,
        departures: false,
        drivers: false,
        exits: false,
        lines: false,
        relations: false,
        remarks: false,
        terminus: false,
        vc_persons: false,
        vc_results: false,
        vc_vehicles: false
    };

    for (var i in tablesExist) {
        if (tablesExist.hasOwnProperty(i)) {
            await tabMan.checkForTable(i)
            .then((to_regclass) => {
                if (to_regclass != null)
                    tablesExist[i] = !tablesExist[i];
            })
            .catch((err) => {
                response.status(500).send(`Błąd serwera SQL: ${err.message} (kod ${err.code})
                podczas sprawdzania tabeli ${i}.`);
                return;
            });
        }
    }

    response.status(200).json(tablesExist);
}

var createTable = async function(request, response) {
    let name = request.params.name;
    let tabCols = columnsSetUp(name);
    if (tabCols != "") {
        await tabMan.createTable(name, tabCols)
        .then((_results) => response.status(201).send(`Tabela ${name} została pomyślnie utworzona.`))
        .catch((err) => response.status(500).send(`Błąd serwera SQL: ${err.message} (kod ${err.code})
        podczas tworzenia tabeli ${name}`));
    } else
        response.status(400).send(`Brak definicji kolumn dla tabeli o nazwie ${name}.`);
}

var createAllTables = async function(request, response) {
    let tabLst = ["brigades", "buses", "drivers", "lines", "remarks", "terminus", "vc_persons", "vc_vehicles", "vc_results", "relations", "brigades_timetable", "departures", "exits"];
    let tabCols = "";

    for (var i in tabLst) {
        tabCols = columnsSetUp(tabLst[i]);

        await tabMan.createTable(tabLst[i], tabCols)
        .catch((err) => {
            response.status(500).send(`Błąd serwera SQL: ${err.message} (kod ${err.code})
            podczas tworzenia tabeli ${tabLst[i]}`);
            return;
        });
    }

    response.status(201).send("Wszystkie tabele zostały pomyślnie utworzone.");
}

function columnsSetUp(name) {
    if (name == "brigades")
        return "id char(6) PRIMARY KEY NOT NULL, line int NOT NULL, in_service boolean NOT NULL";
    else if (name == "brigades_timetable")
        return "id int PRIMARY KEY NOT NULL, brigade char(6) NOT NULL REFERENCES brigades (id), relation char(6) NOT NULL REFERENCES relations (id), remarks char(1) NOT NULL REFERENCES remarks (id), dep_time char(5) NOT NULL, arr_time char(5) NOT NULL";
    else if (name == "buses")
        return "id bigint PRIMARY KEY NOT NULL, fname text NOT NULL, lname text NOT NULL, bday_date text NOT NULL, phone bigint NOT NULL, email text, addr_strtname text NOT NULL, addr_bldgnmbr int NOT NULL, addr_apmtnmbr int, city text NOT NULL, zip text NOT NULL";
    else if (name == "departures")
        return `id serial PRIMARY KEY NOT NULL, "date" date NOT NULL, "time" time without time zone NOT NULL, brigade char(6) NOT NULL REFERENCES brigades (id), bus_id bigint NOT NULL REFERENCES buses (id), driver bigint NOT NULL REFERENCES drivers (id)`;
    else if (name == "drivers")
        return "id bigint PRIMARY KEY NOT NULL, fname text NOT NULL, lname text NOT NULL, bday_date text NOT NULL, phone bigint NOT NULL, email text, addr_strtname text NOT NULL, addr_bldgnmbr int NOT NULL, addr_apmtnmbr int, city text NOT NULL, zip text NOT NULL";
    else if (name == "exits")
        return `id serial PRIMARY KEY NOT NULL, "date" date NOT NULL, "time" time without time zone NOT NULL, brigade char(6) NOT NULL REFERENCES brigades (id), bus_id bigint NOT NULL REFERENCES buses (id), driver bigint NOT NULL REFERENCES drivers (id)`;
    else if (name == "lines")
        return "id int PRIMARY KEY NOT NULL, name text";
    else if (name == "relations")
        return `id char(6) PRIMARY KEY NOT NULL, line int NOT NULL REFERENCES lines (id), start int NOT NULL REFERENCES terminus (id), "end" int NOT NULL REFERENCES terminus (id)`;
    else if (name == "remarks")
        return "id char(1) PRIMARY KEY NOT NULL, name text NOT NULL";
    else if (name == "terminus")
        return "id serial PRIMARY KEY NOT NULL, name text NOT NULL";
    else if (name == "vc_persons")
        return "id bigint PRIMARY KEY NOT NULL, fname text NOT NULL, lname text NOT NULL, idcard text NOT NULL, phone text NOT NULL, email text, bday_date date NOT NULL, addr_strtname text NOT NULL, addr_bldgnmbr int NOT NULL, addr_apmtnmbr int, city text NOT NULL, zip text NOT NULL";
    else if (name == "vc_results")
        return "id serial PRIMARY KEY NOT NULL, car_id int NOT NULL REFERENCES vc_vehicles (id), cntl_date date NOT NULL, cntl_time time without time zone NOT NULL, brkds_front_test boolean NOT NULL, brkpd_front_test boolean NOT NULL, brkds_rear_test boolean NOT NULL, brkpd_rear_test boolean NOT NULL, brkdrum_test boolean NOT NULL";
    else if (name == "vc_vehicles")
        return "id serial PRIMARY KEY NOT NULL, brand text NOT NULL, model text NOT NULL, vrn text NOT NULL, person bigint NOT NULL REFERENCES vc_persons (id), vin text NOT NULL, yr_prod int NOT NULL, mileage bigint NOT NULL, eng_cpct integer NOT NULL, eng_type text NOT NULL";
    else
        return "";
}

exports.checkAllTables = checkAllTables;
exports.createTable = createTable;
exports.createAllTables = createAllTables;
