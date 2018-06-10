/**
 * Generated using theia-extension-generator
 */

import { ContainerModule } from "inversify";
import { bindYAMLPreferences } from './yaml-preferences';
import { LanguageClientContribution } from "@theia/languages/lib/browser";
import { YAMLClientContribution } from "./yaml-client-contribution";

export default new ContainerModule(bind => {
    bindYAMLPreferences(bind);
    bind(LanguageClientContribution).to(YAMLClientContribution).inSingletonScope();
});