/*
 * Copyright (c) 2012-2018 Red Hat, Inc.
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
package org.eclipse.che.ide.ui.multisplitpanel.panel;

import com.google.gwt.user.client.ui.IsWidget;
import org.eclipse.che.commons.annotation.Nullable;
import org.eclipse.che.ide.api.mvp.View;
import org.eclipse.che.ide.ui.multisplitpanel.SubPanel;
import org.eclipse.che.ide.ui.multisplitpanel.WidgetToShow;
import org.eclipse.che.ide.ui.multisplitpanel.tab.Tab;

/**
 * View of {@link SubPanelPresenter}.
 *
 * @author Artem Zatsarynnyi
 */
public interface SubPanelView extends View<SubPanelView.ActionDelegate> {

  /**
   * Split panel horizontally on two sub-panels and set the given {@code widget} for additional
   * panel.
   */
  void splitHorizontally(SubPanelView view);

  /**
   * Split panel vertically on two sub-panels and set the given {@code widget} for additional panel.
   */
  void splitVertically(SubPanelView view);

  /** Show (activate) the {@code tab} if it exists on this panel. */
  void activateTab(Tab tab);

  /**
   * Add the given {@code widget} to this panel.
   *
   * @param widget widget to add
   * @param removable whether the {@code widget} may be removed by user from the UI
   */
  void addWidget(WidgetToShow widget, boolean removable);

  /** Show (activate) the {@code widget} if it exists on this panel. */
  void activateWidget(WidgetToShow widget);

  /**
   * Remove the given {@code widget} from this panel. Nearby widget will be activated if widget for
   * removing is active {@link Tab}. To override this behavior use {@link
   * #removeWidget(WidgetToShow, ActiveTabClosedHandler)}
   *
   * @param widget widget to remove
   */
  default void removeWidget(WidgetToShow widget) {
    removeWidget(widget, SubPanelView::activateTab);
  }

  /**
   * Remove the given {@code widget} from this panel.
   *
   * @param widget widget to remove
   * @param handler provides ability to process case when widget for removing is active {@link Tab}
   */
  void removeWidget(WidgetToShow widget, ActiveTabClosedHandler handler);

  /** Close panel. */
  void closePanel();

  /** Set parent {@link SubPanelView} in case this panel is 'child' of another panel. */
  void setParentPanel(@Nullable SubPanelView parentPanel);

  interface ActionDelegate {

    /** Called when the {@code widget} gains the focus. */
    void onWidgetFocused(IsWidget widget);

    /** Called when the widget tab has been double clicked. */
    void onWidgetDoubleClicked(IsWidget widget);

    /** Called when the {@code widget} is going to be removed from the panel. */
    void onWidgetRemoving(IsWidget widget, SubPanel.RemoveCallback removeCallback);

    /** Called when the `Add Tab` button has been clicked. */
    void onAddTabButtonClicked(int mouseX, int mouseY);
  }
}
