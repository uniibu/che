/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { By } from 'selenium-webdriver';
import { Ide } from '../pageobjects/ide/Ide';
import { ProjectTree } from '../pageobjects/ide/ProjectTree';
import { Editor } from '../pageobjects/ide/Editor';
import { TimeoutConstants } from '../TimeoutConstants';
import { DriverHelper } from '../utils/DriverHelper';
import { CLASSES } from '../inversify.types';

@injectable()
export class ProjectAndFileTests {

    constructor(
        @inject(CLASSES.Ide) private readonly ide: Ide,
        @inject(CLASSES.DriverHelper) private readonly driverHelper: DriverHelper,
        @inject(CLASSES.ProjectTree) private readonly projectTree: ProjectTree,
        @inject(CLASSES.Editor) private readonly editor: Editor) {}

    public waitWorkspaceReadiness(sampleName : string, folder: string) {
        test('Wait for workspace readiness', async () => {
            await this.ide.waitAndSwitchToIdeFrame();
            await this.ide.waitIde(TimeoutConstants.TS_SELENIUM_START_WORKSPACE_TIMEOUT);
            await this.projectTree.openProjectTreeContainer();
            await this.projectTree.waitProjectImported(sampleName, folder);
        });
    }

    public waitWorkspaceReadinessNoSubfolder(sampleName : string) {
        test('Wait for workspace readiness', async () => {
            await this.ide.waitAndSwitchToIdeFrame();
            await this.ide.waitIde(TimeoutConstants.TS_SELENIUM_START_WORKSPACE_TIMEOUT);
            await this.projectTree.openProjectTreeContainer();
            await this.projectTree.waitProjectImportedNoSubfolder(sampleName);
        });
    }

    public openFile(filePath: string, fileName: string) {
        test('Expand project and open file in editor', async () => {
            await this.projectTree.expandPathAndOpenFile(filePath, fileName);
            await this.editor.selectTab(fileName);
        });
    }

    public checkFileNotExists(filePath: string) {
        test('Check that file is not exist in project', async () => {
            await this.projectTree.waitItemDisappearance(filePath);
        });
    }

    public checkProjectBranchName(branchName: string) {
        test('Check branch name is ${}', async () => {
            await this.driverHelper.waitVisibility(By.xpath(`//div[@id='theia-statusBar']/div//span[text()=' ${branchName}']`));
        });
    }
}
