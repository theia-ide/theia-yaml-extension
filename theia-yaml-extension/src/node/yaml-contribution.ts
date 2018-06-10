/*
 * Copyright (c) 2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import { injectable } from "inversify";
import { BaseLanguageServerContribution, IConnection } from "@theia/languages/lib/node";
import { YAML_LANGUAGE_ID, YAML_LANGUAGE_NAME } from '../common';
import * as path from 'path';

@injectable()
export class YAMLContribution extends BaseLanguageServerContribution {

    readonly id = YAML_LANGUAGE_ID;
    readonly name = YAML_LANGUAGE_NAME;

    start(clientConnection: IConnection): void {
        const command = 'node';
        const args: string[] = [
            path.resolve(__dirname, './yaml-starter'),
            '--stdio'
        ];
        try {
            const serverConnection = this.createProcessStreamConnection(command, args);
            serverConnection.reader.onError(err => {
                console.log(err)
            })
            this.forward(clientConnection, serverConnection);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    protected onDidFailSpawnProcess(error: Error): void {
        super.onDidFailSpawnProcess(error);
        console.error("Error starting yaml language server.");
    }

}