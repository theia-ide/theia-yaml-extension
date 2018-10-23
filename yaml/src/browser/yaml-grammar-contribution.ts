/********************************************************************************
 * Copyright (C) 2018 TypeFox and others.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 ********************************************************************************/

import { LanguageGrammarDefinitionContribution, TextmateRegistry } from "@theia/monaco/lib/browser/textmate";
import { injectable } from "inversify";
import { YAML_LANGUAGE_ID } from "../common";

@injectable()
export class YamlGrammarContribution implements LanguageGrammarDefinitionContribution {

    readonly config: monaco.languages.LanguageConfiguration = {
        comments: {
            lineComment: "#"
        },
        brackets: [
            ["{", "}"],
            ["[", "]"],
            ["(", ")"]
        ],
        autoClosingPairs: [
            { open: "{", close: "}" },
            { open: "[", close: "]" },
            { open: "(", close: ")" },
            { open: "\"", close: "\"" },
            { open: "'", close: "'" }
        ],
        surroundingPairs: [
            { open: "{", close: "}" },
            { open: "[", close: "]" },
            { open: "(", close: ")" },
            { open: "\"", close: "\"" },
            { open: "'", close: "'" }
        ],
        indentationRules: {
            increaseIndentPattern: new RegExp("^\\s*.*(:|-) ?(&amp;\\w+)?(\\{[^}\"']*|\\([^)\"']*)?$"),
            decreaseIndentPattern: new RegExp("^\\s+\\}$")
        }
    };

    registerTextmateLanguage(registry: TextmateRegistry) {
        monaco.languages.register({
            id: YAML_LANGUAGE_ID,
            "aliases": [
                "YAML",
                "yaml"
            ],
            "extensions": [
                ".yml",
                ".eyaml",
                ".eyml",
                ".yaml"
            ],
            "filenames": [],
            "firstLine": "^#cloud-config"
        });

        monaco.languages.setLanguageConfiguration(YAML_LANGUAGE_ID, this.config);

        const yamlGrammar = require('../../data/yaml.tmLanguage.json');
        registry.registerTextmateGrammarScope('source.yaml', {
            async getGrammarDefinition() {
                return {
                    format: 'json',
                    content: yamlGrammar
                };
            }
        });

        registry.mapLanguageIdToTextmateGrammar(YAML_LANGUAGE_ID, 'source.yaml');
    }
}