/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { Key } from 'selenium-webdriver';
import { e2eContainer } from '../../inversify.config';
import { CLASSES } from '../../inversify.types';
import { Ide } from '../../pageobjects/ide/Ide';
import { ProjectTree } from '../../pageobjects/ide/ProjectTree';
import { Editor } from '../../pageobjects/ide/Editor';
import { DriverHelper } from '../../utils/DriverHelper';
import { TestConstants } from '../../TestConstants';
import { TimeoutConstants } from '../../TimeoutConstants';
import { WorkspaceNameHandler } from '../../utils/WorkspaceNameHandler';
import { Terminal } from '../../pageobjects/ide/Terminal';
import { Logger } from '../../utils/Logger';
import { WorkspaceHandlingTests } from '../../testsLibrary/WorkspaceHandlingTests';

const ide: Ide = e2eContainer.get(CLASSES.Ide);
const projectTree: ProjectTree = e2eContainer.get(CLASSES.ProjectTree);
const editor: Editor = e2eContainer.get(CLASSES.Editor);
const driverHelper: DriverHelper = e2eContainer.get(CLASSES.DriverHelper);
const terminal: Terminal = e2eContainer.get(CLASSES.Terminal);
const workspaceHandlingTests: WorkspaceHandlingTests = e2eContainer.get(CLASSES.WorkspaceHandlingTests);

let workspaceName: string = '';

const devfileUrl: string = 'https://raw.githubusercontent.com/eclipse/che/master/tests/e2e/files/devfiles/plugins/VscodeValePlugin.yaml';
const factoryUrl: string = `${TestConstants.TS_SELENIUM_BASE_URL}/f?url=${devfileUrl}`;
const projectName: string = 'che-docs';
const pathToFile: string = `${projectName}/modules/administration-guide/partials`;
const docFileName: string = 'assembly_authenticating-users.adoc';

suite('The "VscodeValePlugin" userstory', async () => {
    suite('Create workspace', async () => {
        test('Create workspace using factory', async () => {
            await driverHelper.navigateToUrl(factoryUrl);
        });

        test('Wait until created workspace is started', async () => {
            await ide.waitAndSwitchToIdeFrame();
            await ide.waitIde(TimeoutConstants.TS_SELENIUM_START_WORKSPACE_TIMEOUT);

            workspaceName = await WorkspaceNameHandler.getNameFromUrl();
        });
    });

    suite('Check workspace readiness to work', async () => {
        test('Wait until project is imported', async () => {
            await projectTree.openProjectTreeContainer();
            await projectTree.waitProjectImported(projectName, 'modules');
        });
    });

    suite('Check the "vale" plugin', async () => {
        test('Check warning in the editor appearance', async () => {
            await projectTree.expandPathAndOpenFile(pathToFile, docFileName);
            await editor.waitWarningInLine(16);
        });

        test('Open the "Problems" terminal tab', async () => {
            await editor.type(docFileName, Key.chord(Key.CONTROL, Key.SHIFT, 'm'), 3);
            await terminal.waitTab('Problems', 60_000);
        });

        test('Check the vale plugin output in the "Problems" tab', async () => {
            await terminal.waitTextInProblemsTab('Keep sentences short and to the point', 60_000);
        });

    });

    suite('Stopping and deleting the workspace', async () => {
        test('Stop and remove workspace', async () => {
            if (TestConstants.TS_DELETE_PLUGINS_TEST_WORKSPACE === 'true') {
                await workspaceHandlingTests.stopAndRemoveWorkspace(workspaceName);
                return;
            }

            Logger.info(`As far as the "TS_DELETE_PLUGINS_TEST_WORKSPACE" value is "false the workspace deletion is skipped"`);
        });
    });
});
