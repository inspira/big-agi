import * as React from 'react';

import { Alert, Box } from '@mui/joy';

import { FormInputKey } from '~/common/components/FormInputKey';
import { InlineError } from '~/common/components/InlineError';
import { Link } from '~/common/components/Link';
import { apiQuery } from '~/common/util/trpc.client';
import { settingsGap } from '~/common/theme';
import { useToggleableBoolean } from '~/common/util/useToggleableBoolean';

import { DModelSourceId, useModelsStore, useSourceSetup } from '../../store-llms';

import { RefetchButton, SetupTextControl } from '../vendor.components';
import { isValidAnthropicApiKey, ModelVendorAnthropic } from './anthropic.vendor';
import { modelDescriptionToDLLM } from '../openai/OpenAISourceSetup';


export function AnthropicSourceSetup(props: { sourceId: DModelSourceId }) {

  // state
  const advanced = useToggleableBoolean();

  // external state
  const { source, sourceHasLLMs, access, updateSetup } =
    useSourceSetup(props.sourceId, ModelVendorAnthropic.getAccess);

  // derived state
  const { anthropicKey, heliconeKey } = access;

  const needsUserKey = !ModelVendorAnthropic.hasServerKey;
  const keyValid = isValidAnthropicApiKey(anthropicKey);
  const keyError = (/*needsUserKey ||*/ !!anthropicKey) && !keyValid;
  const shallFetchSucceed = anthropicKey ? keyValid : !needsUserKey;

  // fetch models
  const { isFetching, refetch, isError, error } = apiQuery.llmAnthropic.listModels.useQuery({
    access,
  }, {
    enabled: !sourceHasLLMs && shallFetchSucceed,
    onSuccess: models => {
      //keep only claude2
      models.models = models.models.filter((item) => item.id.toLowerCase()=='claude-2.0');
      source && useModelsStore.getState().addLLMs(models.models.map(model => modelDescriptionToDLLM(model, source)))
    },
    staleTime: Infinity,
  });

  return <Box sx={{ display: 'flex', flexDirection: 'column', gap: settingsGap }}>

    <FormInputKey
      id='anthropic-key' label='Anthropic API Key'
      rightLabel={<>{needsUserKey
        ? !anthropicKey && <Link level='body-sm' href='https://www.anthropic.com/earlyaccess' target='_blank'>request Key</Link>
        : '✔️ already set in server'
      } {anthropicKey && keyValid && <Link level='body-sm' href='https://console.anthropic.com/' target='_blank'>check usage</Link>}
      </>}
      value={anthropicKey} onChange={value => updateSetup({ anthropicKey: value })}
      required={needsUserKey} isError={keyError}
      placeholder='sk-...'
    />

    {advanced.on && <SetupTextControl
      title='Helicone Key'
      description={<>Generate <Link level='body-sm' href='https://www.helicone.ai/keys' target='_blank'>here</Link></>}
      placeholder='sk-...'
      value={heliconeKey || ''}
      onChange={text => updateSetup({ heliconeKey: text })}
    />}

    {!!heliconeKey && <Alert variant='soft' color='success'>
      Advanced: You set the Helicone key, and Anthropic text will be routed through Helicone.
    </Alert>}

    <RefetchButton refetch={refetch} disabled={!shallFetchSucceed || isFetching} error={isError} advanced={advanced} />

    {isError && <InlineError error={error} />}

  </Box>;
}