import { GamesPlayed } from ".";
import { Prisoner } from "./prisoners";

const sqlite3 = require('sqlite3').verbose();

export class Db {
    db: any;
    constructor () {
        this.db = new sqlite3.Database('./prisonersDilema.db', (err: { message: any; }) => {
            if (err) {
                console.error(err.message);
            }
        });
        this.createTable();
    }

    private createTable () {
        const  createTableAndTriggerSql = `
            CREATE TABLE IF NOT EXISTS gamesPlayed (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                gamesPlayed TEXT,  -- JSON data for the games played
                createDate TEXT DEFAULT (datetime('now'))  -- Creation date of that inserted game
            );
        `;
        this.db.run(createTableAndTriggerSql, (err: { message: any; }) => {
            if (err) {
                console.error(err.message);
            }
            this.createTrigger()
        });
    }

    private createTrigger() {
        const dropTriggerSql = `DROP TRIGGER IF EXISTS validate_gamesPlayed_jsons;`;

        const createTriggerSql = `
            CREATE TRIGGER validate_gamesPlayed_jsons
            BEFORE INSERT ON gamesPlayed
            BEGIN
                SELECT CASE
                    WHEN json_valid(new.gamesPlayed) = 0 THEN
                        RAISE(ABORT, 'Invalid JSON data in gamesPlayed')
                END;
            END;
        `;

        this.db.run(dropTriggerSql, (err: { message: any; }) => {
            if (err) {
                console.error('Error dropping existing trigger:', err.message);
            } else {
                this.db.run(createTriggerSql, (err: { message: any; }) => {
                    if (err) {
                        console.error('Error creating trigger:', err.message);
                    }
                });
            }
        });
    }

    public insertGamesPlayed (gamesPlayed: string) {
        const query = `INSERT INTO gamesPlayed (gamesPlayed) VALUES (?)`
        this.db.run(query, [gamesPlayed], (err: { message: any; }) => {
            if (err) {
                return console.error(err.message);
            }
        });
    }

    public closeDb () {
        this.db.close((err: { message: any; }) => {
            if (err) {
              console.error(err.message);
            }
          });
    }
    
    private static instance: Db;
    public static get Instance(): Db {
        return this.instance || (this.instance = new this());
    }
}


