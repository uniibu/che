// /*********************************************************************
//  * Copyright (c) 2020 Red Hat, Inc.
//  *
//  * This program and the accompanying materials are made
//  * available under the terms of the Eclipse Public License 2.0
//  * which is available at https://www.eclipse.org/legal/epl-2.0/
//  *
//  * SPDX-License-Identifier: EPL-2.0
//  **********************************************************************/

import { e2eContainer } from '../../inversify.config';
import { CLASSES } from '../../inversify.types';
import { TestConstants } from '../../TestConstants';
import { DriverHelper } from '../../utils/DriverHelper';
import { WorkspaceNameHandler } from '../..';
import { ProjectAndFileTests } from '../../testsLibrary/ProjectAndFileTests';
import { WorkspaceHandlingTests } from '../../testsLibrary/WorkspaceHandlingTests';

const workspaceHandlingTests: WorkspaceHandlingTests = e2eContainer.get(CLASSES.WorkspaceHandlingTests);
const projectAndFileTests: ProjectAndFileTests = e2eContainer.get(CLASSES.ProjectAndFileTests);
const driverHelper: DriverHelper = e2eContainer.get(CLASSES.DriverHelper);

// the suite expect user to be logged in
suite('Workspace creation via factory url', async () => {

    let factoryUrl : string = `${TestConstants.TS_SELENIUM_BASE_URL}/f?url=https://github.com/che-samples/console-java-simple/tree/java1.11`;
    const workspaceSampleName: string = 'console-java-simple';
    const workspaceRootFolderName: string = 'src';
    const fileFolderPath: string = `${workspaceSampleName}/${workspaceRootFolderName}/main/java/org/eclipse/che/examples`;
    const tabTitle: string = 'HelloWorld.java';

    suite('Open factory URL', async () => {
        test(`Navigating to factory URL`, async () => {
            await driverHelper.navigateToUrl(factoryUrl);
        });
    });

    suite('Wait workspace readyness', async () => {
        projectAndFileTests.waitWorkspaceReadiness(workspaceSampleName, workspaceRootFolderName);
    });

    suite('Check imported project', async () => {
        projectAndFileTests.openFile(fileFolderPath, tabTitle);
        projectAndFileTests.checkProjectBranchName('java1.11');
    });

    suite ('Stopping and deleting the workspace', async () => {
        let workspaceName = 'not defined';
        suiteSetup( async () => {
            workspaceName = await WorkspaceNameHandler.getNameFromUrl();
        });
        test (`Stop workspace`, async () => {
            await workspaceHandlingTests.stopWorkspace(workspaceName);
        });
        test (`Remove workspace`, async () => {
            await workspaceHandlingTests.removeWorkspace(workspaceName);
        });
    });

});
