import fs from "fs";
import os from "os";
import path from "path";
import { stringify } from "querystring";

export type Config = {
    dbUrl: string,
    currentUserName?: string
};

function getConfigFilePath(): string {
    return path.join(os.homedir(),".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
    const config_obj = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName
    };

    const cfg_json = JSON.stringify(config_obj);

    fs.writeFileSync(getConfigFilePath(),cfg_json, {encoding: "utf-8"});
}

function validateConfig(rawConfig: any): Config {
    if (!rawConfig.db_url || typeof rawConfig.db_url != "string") {
        throw new Error("Missing or invalid database URL");
    }

    if (rawConfig.current_user_name !== undefined && typeof rawConfig.current_user_name !== "string") {
    throw new Error("current_user_name must be a string");
    }

    const cfg: Config = {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name
    };

    return cfg;

}

export function readConfig(): Config {
    const filepath = getConfigFilePath();
    const configJSON = fs.readFileSync(filepath, {encoding: "utf-8"});
    const configObj = JSON.parse(configJSON);
    const validated = validateConfig(configObj);
    return validated;
}

export function setUser(username: string): void {
    const config: Config = readConfig();
    config.currentUserName = username;
    writeConfig(config);
}