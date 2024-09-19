# Models

## Flagship model
### [llama3.1 8B](/Getstarted/Models/Models/#gpt-4o_2)
The upgraded versions of the 8B and 70B models are multilingual and have a significantly longer context length of 128K, state-of-the-art tool use, and overall stronger reasoning capabilities. This enables Meta’s latest models to support advanced use cases, such as long-form text summarization, multilingual conversational agents, and coding assistants.

## Models overview
The Name_Placeholder API is powered by a diverse set of models with different capabilities and price points. You can also make customizations to our models for your specific use case with fine-tuning.

### Model	Description

#### [llama3.1 8B](/Getstarted/Models/Models/#gpt-4o_2)
The upgraded versions of the 8B and 70B models are multilingual and have a significantly longer context length of 128K, state-of-the-art tool use, and overall stronger reasoning capabilities. This enables Meta’s latest models to support advanced use cases, such as long-form text summarization, multilingual conversational agents, and coding assistants.

#### [llama3.1 70B](/Getstarted/Models/Models/#gpt-4o-mini_2)
The upgraded versions of the 8B and 70B models are multilingual and have a significantly longer context length of 128K, state-of-the-art tool use, and overall stronger reasoning capabilities. This enables Meta’s latest models to support advanced use cases, such as long-form text summarization, multilingual conversational agents, and coding assistants. 

#### [llama3.1 405B](/Getstarted/Models/Models/#o1-preview-and-o1-mini-beta)
Llama 3.1 405B is the first openly available model that rivals the top AI models when it comes to state-of-the-art capabilities in general knowledge, steerability, math, tool use, and multilingual translation.

We have also published open source models including Point-E, Whisper, Jukebox, and CLIP.

#### Continuous model upgrades
`gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`, `gpt-4`, and `gpt-3.5-turbo` point to their respective latest model version. You can verify this by looking at the response object after sending a request. The response will include the specific model version used (e.g. `gpt-3.5-turbo-1106`). The `chatgpt-4o-latest` model version continuously points to the version of GPT-4o used in ChatGPT, and is updated frequently.

With the exception of `chatgpt-4o-latest`, we offer pinned model versions that developers can continue using for at least three months after an updated model has been introduced. With the new cadence of model updates, we are also giving developers the ability to contribute evals to help us improve the model for different use cases. If you are interested, check out the OpenAI Evals repository.

Learn more about model deprecation on our deprecation page.

## llama3.1 8B
The upgraded versions of the 8B and 70B models are multilingual and have a significantly longer context length of 128K, state-of-the-art tool use, and overall stronger reasoning capabilities. This enables Meta’s latest models to support advanced use cases, such as long-form text summarization, multilingual conversational agents, and coding assistants.

!!! info
    [1] Starting October 2nd, 2024, `gpt-4o` will point to the `gpt-4o-2024-08-06` snapshot.
    
    [2] We are releasing this model for developers and researchers to explore OpenAI's latest research. For production use, OpenAI recommends using dated GPT models, which are optimized for API usage.

## llama3.1 70B
The upgraded versions of the 8B and 70B models are multilingual and have a significantly longer context length of 128K, state-of-the-art tool use, and overall stronger reasoning capabilities. This enables Meta’s latest models to support advanced use cases, such as long-form text summarization, multilingual conversational agents, and coding assistants.

## llama3.1 405B
Llama 3.1 405B is the first openly available model that rivals the top AI models when it comes to state-of-the-art capabilities in general knowledge, steerability, math, tool use, and multilingual translation.

There are two model types available today:

- __o1-preview__: reasoning model designed to solve hard problems across domains.
- __o1-mini__: faster and cheaper reasoning model particularly good at coding, math, and science.