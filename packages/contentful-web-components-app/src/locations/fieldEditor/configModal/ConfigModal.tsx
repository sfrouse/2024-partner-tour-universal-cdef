import React from "react";
import { Flex, IconButton, Modal, Switch, Tooltip } from '@contentful/f36-components';
import {
  PuzzleIcon,
  SettingsTrimmedIcon,
  AssetTrimmedIcon,
  CodeTrimmedIcon,
  ErrorCircleOutlineIcon,
  GiftIcon
} from '@contentful/f36-icons';
import { FieldAppSDK } from "@contentful/app-sdk";
import CUIToolbarLabel from "../../../ctfl-ui-editor/toolbar-label/ToolbarLabel";

export default function ConfigModal(
  args: {
    setConfigOpen: (val: boolean) => void,
    showBoundFields: boolean,
    setShowBoundFields: (val: boolean) => void,
    reset: () => void,
    sdk: FieldAppSDK
  }
) {

  const {
    setConfigOpen,
    showBoundFields,
    setShowBoundFields,
    reset,
    sdk
  } = args;

  const openDialog = async () => {
    // const album = 
    await sdk.dialogs.openCurrentApp({
      width: 'fullWidth', minHeight: '80vh',
      parameters: {test: 5},
      title: 'My Modal',
      allowHeightOverflow: true,
      shouldCloseOnEscapePress: true,
      shouldCloseOnOverlayClick: true,
    });
    // if (album) {
    //   setAlbumData(album);
    // }
  };

  return (
    <Modal onClose={() => setConfigOpen(false)} isShown>
        {() => (
          <>
            <Modal.Header
              title="Configuration"
              onClose={() => setConfigOpen(false)}
            />
            <Modal.Content>
              <Flex flexDirection="column" gap="10px">
                <Flex flexDirection="column" gap="0px">
                  <CUIToolbarLabel value="Settings:" />
                  <Flex flexDirection="row" alignItems="center" gap="8px">
                    <Tooltip
                      content="Application Definition">
                      <IconButton
                        icon={<PuzzleIcon />}
                        variant="secondary"
                        aria-label='Application Definition'
                        size="small"
                        onClick={() => {
                          window.open(
                            `https://app.contentful.com/account/organizations/${
                              sdk.ids.organization
                            }/apps/definitions/${
                              sdk.ids.app
                            }/general`,
                            '_blank'
                          )?.focus();
                        }}
                      />
                    </Tooltip>
                    <Tooltip
                      content="Application Configuration">
                      <IconButton
                        icon={<SettingsTrimmedIcon />}
                        variant="secondary"
                        aria-label='Application Configuration'
                        size="small"
                        onClick={() => {
                          window.open(
                            `https://app.contentful.com/spaces/${
                              sdk.ids.space
                            }/environments/${sdk.ids.environment}/apps/${
                              sdk.ids.app
                            }`,
                            '_blank'
                          )?.focus();
                        }}
                      />
                    </Tooltip>
                    <Tooltip
                      content="Preview Configuration">
                      <IconButton
                        icon={<AssetTrimmedIcon />}
                        variant="secondary"
                        aria-label='Preview Config'
                        size="small"
                        onClick={() => {
                          // It's master b/c it's a global setting...?
                          window.open(
                            `https://app.contentful.com/spaces/${
                              sdk.ids.space
                            }/environments/master/settings/content_preview`,
                            '_blank'
                          )?.focus();
                        }}
                      />
                    </Tooltip>
                  </Flex>
                </Flex>
                <Flex flexDirection="column" gap="0px">
                  <CUIToolbarLabel value="Show all fields:" />
                  <Switch
                    isChecked={showBoundFields}
                    onChange={() => {
                      setShowBoundFields(!showBoundFields);
                    }}>
                  </Switch>
                </Flex>
                <Flex flexDirection="column" gap="0px">
                  <CUIToolbarLabel value="Functions:" />
                  <Flex flexDirection="row" alignItems="center" gap="8px">
                    <Tooltip
                      content="Console Information">
                      <IconButton
                        icon={<CodeTrimmedIcon />}
                        variant="secondary"
                        aria-label='Console Information'
                        size="small"
                        onClick={() => {
                          console.log('sdk.entry', sdk.entry);
                          console.log('sdk.field', sdk.field);
                          console.log('sdk.field.getValue()', sdk.field.getValue());
                          // console.log('defaultWebComponents', defaultWebComponents);
                        }}
                      />
                    </Tooltip>
                    <Tooltip
                      content="Console Fields">
                      <IconButton
                        icon={<CodeTrimmedIcon />}
                        variant="secondary"
                        aria-label='Console Fields'
                        size="small"
                        onClick={() => {
                          Object.entries(sdk.entry.fields).map(entry => {
                            const name = entry[0];
                            const field = entry[1];
                            console.log(name, field.getValue());
                            return true;
                          })
                        }}
                      />
                    </Tooltip>
                    <Tooltip
                      content="Delete CDef Instance">
                      <IconButton
                        icon={<ErrorCircleOutlineIcon />}
                        variant="secondary"
                        aria-label='Delete CDef Instance'
                        size="small"
                        onClick={reset}
                      />
                    </Tooltip>
                    <Tooltip
                      content="Show Dialog Modal">
                      <IconButton
                        icon={<GiftIcon />}
                        variant="primary"
                        aria-label='Show Dialog Modal'
                        size="small"
                        onClick={openDialog}
                      />
                    </Tooltip>
                  </Flex>
                </Flex>
              </Flex>
            </Modal.Content>
          </>
        )}
      </Modal>
  );
}