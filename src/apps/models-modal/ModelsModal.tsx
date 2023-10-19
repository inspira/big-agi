import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { Checkbox, Divider } from '@mui/joy';

import { GoodModal } from '~/common/components/GoodModal';
import { useUIStateStore } from '~/common/state/store-ui';

import { DModelSourceId, useModelsStore } from '~/modules/llms/store-llms';
import { createModelSourceForDefaultVendor } from '~/modules/llms/vendors/vendor.registry';

import { LLMOptionsModal } from './LLMOptionsModal';
import { ModelsList } from './ModelsList';
import { ModelsSourceSelector } from './ModelsSourceSelector';
import { VendorSourceSetup } from './VendorSourceSetup';

import { apiQuery } from '~/modules/trpc/trpc.client';
import { useSourceSetup } from '~/modules/llms/store-llms';
import { ModelVendorAnthropic, hasServerKeyAnthropic, isValidAnthropicApiKey } from '~/modules/llms/vendors/anthropic/anthropic.vendor';
// Anthropic uses this from OpenAI in AnthropicSourceSetup.tsx
import { modelDescriptionToDLLM } from '~/modules/llms/vendors/openai/OpenAISourceSetup';

export function ModelsModal(props: { suspendAutoModelsSetup?: boolean }) {

  // local state
  const [_selectedSourceId, setSelectedSourceId] = React.useState<DModelSourceId | null>(null);
  const [showAllSources, setShowAllSources] = React.useState<boolean>(false);

  // external state
  const { modelsSetupOpen, openModelsSetup, closeModelsSetup, llmOptionsId } = useUIStateStore();
  const { modelSources, llmCount } = useModelsStore(state => ({
    modelSources: state.sources,
    llmCount: state.llms.length,
  }), shallow);

  // auto-select the first source - note: we could use a useEffect() here, but this is more efficient
  // also note that state-persistence is unneeded
  const selectedSourceId = _selectedSourceId ?? modelSources[0]?.id ?? null;

  const activeSource = modelSources.find(source => source.id === selectedSourceId);

  const multiSource = modelSources.length > 1;

  // if no sources at startup, open the modal
  React.useEffect(() => {
    if (!selectedSourceId && !props.suspendAutoModelsSetup)
      openModelsSetup();
  }, [selectedSourceId, openModelsSetup, props.suspendAutoModelsSetup]);



  // setup Anthropic model for cold setup - uses code in AnthropicSourceSetup.tsx

  // external state
  const {
    source, sourceLLMs, updateSetup,
    normSetup: { anthropicKey, anthropicHost },
  } = useSourceSetup(selectedSourceId, ModelVendorAnthropic.normalizeSetup);

  const hasModels = !!sourceLLMs.length;
  const needsUserKey = !hasServerKeyAnthropic;
  const keyValid = isValidAnthropicApiKey(anthropicKey);
  const shallFetchSucceed = anthropicKey ? keyValid : !needsUserKey;

  // fetch models
  const { isFetching, refetch, isError, error } = apiQuery.llmAnthropic.listModels.useQuery({
    access: { anthropicKey, anthropicHost },
  }, {
    enabled: !hasModels && shallFetchSucceed,
    onSuccess: models => {
      //keep only claude2
      models.models = models.models.filter((item) => item.id.toLowerCase()=='claude-2.0');
      source && useModelsStore.getState().addLLMs(models.models.map(model => modelDescriptionToDLLM(model, source)))
    },
    staleTime: Infinity,
  });


  

  // add the default source on cold - will require setup
  React.useEffect(() => {
    const { addSource, sources } = useModelsStore.getState();
    if (!sources.length && !props.suspendAutoModelsSetup)
      addSource(createModelSourceForDefaultVendor(sources));
  }, [props.suspendAutoModelsSetup]);


  return <>

    {/* Sources Setup */}
    {modelsSetupOpen && <GoodModal
      title={<>Configure <b>AI Models</b></>}
      startButton={
        multiSource ? <Checkbox
          label='all vendors' sx={{ my: 'auto' }}
          checked={showAllSources} onChange={() => setShowAllSources(all => !all)}
        /> : undefined
      }
      open={modelsSetupOpen} onClose={closeModelsSetup}
    >

      <ModelsSourceSelector selectedSourceId={selectedSourceId} setSelectedSourceId={setSelectedSourceId} />

      {!!activeSource && <Divider />}

      {!!activeSource && <VendorSourceSetup source={activeSource} />}

      {!!llmCount && <Divider />}

      {!!llmCount && <ModelsList filterSourceId={showAllSources ? null : selectedSourceId} />}

      <Divider />

    </GoodModal>}

    {/* per-LLM options */}
    {!!llmOptionsId && <LLMOptionsModal id={llmOptionsId} />}

  </>;
}