const router = require('express').Router();
const tables = require('./db/table-routes.js');

router.get('/checkAllTables', function(req, res) { tables.checkAllTables(req, res) });
router.post('/createTable/:name', function(req, res) { tables.createTable(req, res) });
router.post('/createAllTables', function(req, res) { tables.createAllTables(req, res) });

/**
 * @swagger
 * /checkAllTables:
 *  get:
 *      tags:
 *          - "Database Management"
 *      summary: "Sprawdzenie obecności tabel w bazie danych."
 *      description: "Operacja sprawdza, czy tabele potrzebne do prawidłowego funkcjonowania aplikacji istnieją w bazie danych, i zwraca użytkownikowi wynik w postaci obiektu JSON. Wartość 'true' oznacza obecność danej tabeli, 'false' jej brak. Do prawidłowego działania aplikacji potrzebne są wszystkie tabele ze zwróconej listy. Jeżeli jakiejś brakuje, należy ją utworzyć przy użyciu operacji 'createTable'. Natomiast jeśli aplikacja używana jest po raz pierwszy, operacja powinna zwrócić wszystkie wartości 'false', co oznacza brak żadnych tabel. Należy wówczas przygotować bazę danych przy użyciu operacji 'createAllTables'."
 *      operationId: "checkTables"
 *      responses:
 *          "200":
 *              description: "Operacja ukończona pomyślnie"
 *          "500":
 *              description: "Błąd serwera SQL"
 * /createTable/{name}:
 *  post:
 *      tags:
 *          - "Database Management"
 *      summary: "Tworzenie JEDNEJ tabeli w bazie danych."
 *      description: "Operacja tworzy w bazie danych tabelę o nazwie podanej w parametrach żądania. Liczba, nazwy, typy danych w kolumnach i relacje między innymi tabelami dobierane są automatycznie na podstawie podanej nazwy. Można tworzyć tylko tabele z listy zwracanej przez operację 'checkAllTables'. Do jednoczesnego utworzenia wszystkich tabel potrzebnych do działania aplikacji należy skorzystać z operacji 'createAllTables'."
 *      operationId: "createTable"
 *      parameters:
 *          - name: "name"
 *            in: "path"
 *            schema:
 *              type: string
 *            required: true
 *            description: "Nazwa tabeli która ma zostać utworzona."
 *            example: "foo"
 *      responses:
 *          "201":
 *              description: "Pomyślnie utworzono tabelę"
 *          "400":
 *              description: "Błąd po stronie klienta"
 *          "500":
 *              description: "Błąd serwera SQL"
 * /createAllTables:
 *  post:
 *      tags:
 *          - "Database Management"
 *      summary: "Tworzenie wszystkich potrzebnych tabel w bazie danych."
 *      description: "Operacja tworzy w bazie danych wszystkie tabele potrzebne do poprawnego działania aplikacji. Liczba, nazwy, typy danych w kolumnach i relacje między innymi tabelami dobierane są automatycznie na podstawie nazwy tworzonej podczas operacji tabeli."
 *      operationId: "createAllTables"
 *      responses:
 *          "201":
 *              description: "Pomyślnie utworzono wszystkie tabele"
 *          "500":
 *              description: "Błąd serwera SQL"
 */

module.exports = router;