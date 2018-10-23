/*
 * Copyright (c) 2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 *   TypeFox (typefox.io)
 */

import { interfaces } from 'inversify';
import { createPreferenceProxy, PreferenceProxy, PreferenceService, PreferenceContribution, PreferenceSchema } from '@theia/core/lib/browser';
import { JsonSchemaConfiguration } from '@theia/core/lib/browser/json-schema-store';

export const YAMLConfigSchema: PreferenceSchema = {
    'type': 'object',
    "properties": {
        "yaml.trace.server": {
            "type": "string",
            "enum": [
                "off",
                "messages",
                "verbose"
            ],
            "default": "off",
            "description": "Traces the communication between VSCode and the languageServerExample service."
        },
        "yaml.schemas": {
            "type": "array",
            'items': {
                'type': 'object',
                'default': {
                    'fileMatch': [
                        '/myfile'
                    ],
                    'url': 'schemaURL'
                },
                'properties': {
                    'url': {
                        'type': 'string',
                        'default': '/user.schema.json',
                        'description': 'A URL to a schema or a relative path to a schema in the current directory'
                    },
                    'fileMatch': {
                        'type': 'array',
                        'items': {
                            'type': 'string',
                            'default': 'MyFile.yaml',
                            'description': 'A file pattern that can contain \'*\' to match against when resolving YAML files to schemas.'
                        },
                        'minItems': 1,
                        'description': 'An array of file patterns to match against when resolving YAML files to JSON schemas.'
                    }
                }
            },
            "description": "Associate schemas to Yaml files in the current workspace"
        },
        "yaml.format.enable": {
            "type": "boolean",
            "default": false,
            "description": "Enable/disable default YAML formatter (requires restart)"
        },
        "yaml.format.singleQuote": {
            "type": "boolean",
            "default": false,
            "description": "Use single quotes instead of double quotes"
        },
        "yaml.format.bracketSpacing": {
            "type": "boolean",
            "default": true,
            "description": "Print spaces between brackets in objects"
        },
        "yaml.format.proseWrap": {
            "type": "string",
            "default": "preserve",
            "enum": [
                "preserve",
                "never",
                "always"
            ],
            "description": "Always: wrap prose if it exeeds the print width, Never: never wrap the prose, Preserve: wrap prose as-is"
        },
        "yaml.validate": {
            "type": "boolean",
            "default": true,
            "description": "Enable/disable validation feature"
        },
        "yaml.hover": {
            "type": "boolean",
            "default": true,
            "description": "Enable/disable hover feature"
        },
        "yaml.completion": {
            "type": "boolean",
            "default": true,
            "description": "Enable/disable completion feature"
        },
        "yaml.customTags": {
            "type": "array",
            "default": [],
            "description": "Custom tags for the parser to use"
        }
    }
};

export interface YAMLConfiguration {
    'yaml.trace.server': 'off'|'messages'|'verbose',
    'yaml.schemas': JsonSchemaConfiguration[],
    'yaml.format.enable': boolean,
    'yaml.format.singleQuote': boolean,
    'yaml.format.bracketSpacing': boolean,
    'yaml.format.proseWrap': 'preserve'|'never'|'always',
    'yaml.validate': boolean,
    'yaml.hover': boolean,
    'yaml.completion': boolean,
    'yaml.customTags': Array<String>
}

export const YAMLPreferences = Symbol('YAMLPreferences');
export type YAMLPreferences = PreferenceProxy<YAMLConfiguration>;

export function createYAMLPreferences(preferences: PreferenceService): YAMLPreferences {
    return createPreferenceProxy(preferences, YAMLConfigSchema);
}

export function bindYAMLPreferences(bind: interfaces.Bind): void {
    bind(YAMLPreferences).toDynamicValue(ctx => {
        const preferences = ctx.container.get<PreferenceService>(PreferenceService);
        return createYAMLPreferences(preferences);
    });
    bind(PreferenceContribution).toConstantValue({ schema: YAMLConfigSchema });
}