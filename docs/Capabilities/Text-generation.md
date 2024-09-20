# Text generation models
WeAI's open-source text generation models (often called generative pre-trained transformers or large language models) have been trained to understand natural language, code. The open-source models provide text outputs in response to their inputs. The text inputs to these models are also referred to as "prompts". Designing a prompt is essentially how you “program” a large language model model, usually by providing instructions or some examples of how to successfully complete a task.

Using WeAI's open-source text generation models, you can build applications to:

- Draft documents
- Write computer code
- Answer questions about a knowledge base
- Analyze texts
- Give software a natural language interface
- Tutor in a range of subjects
- Translate languages
- Simulate characters for games

To use one of these models via the WeAI API, you’ll send a request to the Chat Completions API containing the inputs and your API key, and receive a response containing the model’s output.

You can experiment with various models in the chat playground.

## Quickstart
Chat models take a list of messages as input and return a model-generated message as output. Although the chat format is designed to make multi-turn conversations easy, it's just as useful for single-turn tasks without any conversation.

An example Chat Completions API call looks like the following:

=== "curl"
 ```
curl https://api.weai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $WEAI_API_KEY" \
  -d '{
    "model": "llama3.1-8",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "What is a LLM?"
      }
    ]
  }'
 ```

=== "python"
```
from weai import WeAI
client = WeAI()
response = client.chat.completions.create(
    model="llama3.1-8",
    messages=[
         {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "What is a LLM?"}
        ]
    )
```

=== "node.js"
```
import WeAI from "weai";

const weai = new WeAI();

async function main() {
  const completion = await weai.chat.completions.create({
    messages: [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is a LLM?"}
      ],
    model: "llama3.1-8",
  });

  console.log(completion.choices[0]);
}
main();
```

To learn more, you can view the Chat Completions guide.

## Prompt engineering
An awareness of the best practices for working with WeAI open-source models can make a significant difference in application performance. The failure modes that each exhibit and the ways of working around or correcting those failure modes are not always intuitive. There is an entire field related to working with language models which has come to be known as "prompt engineering", but as the field has progressed its scope has outgrown merely engineering the prompt into engineering systems that use model queries as components.

To learn more, read our guide on prompt engineering which covers methods to improve model reasoning, reduce the likelihood of model hallucinations, and more.

## FAQ
### Which model should I use?
We generally recommend that you default to using either `llama3.1-8`.

If your use case requires high intelligence or reasoning about images as well as text, we recommend you evaluate both `llama3.1-70` and `llama3.1-405`.

If your use case requires the fastest speed and lowest cost, we recommend `llama3.1-8` since it is optimized for these aspects.

We recommend using `llama3.1-8` where you would have previously used `llama3.1-70` as it is cheaper with higher intelligence.

You can experiment in the playground to investigate which models provide the best price performance trade-off for your usage. A common design pattern is to use several distinct query types which are each dispatched to the model appropriate to handle them.

### How should I set the temperature parameter?
You can think of temperature like randomness, with 0 being least random (or most deterministic) and 2 being most random (least deterministic). 
When using low values for temperature (e.g. 0.2) the model responses will tend to be more consistent but may feel more robotic. Values higher than 1.0, especially values close to 2.0, can lead to erratic model outputs. If your goal is creative outputs, a combination of a slightly higher than normal temperature (e.g. 1.2) combined with a prompt specifically asking the model to be creative may be your best bet, but we encourage experimentation.

### Is fine-tuning available for the latest models?
See the fine-tuning guide for the latest information on which models are available for fine-tuning and how to get started.

### How can I make my application more safe?
If you want to add a moderation layer to the outputs of the Chat API, you can follow our moderation guide to prevent content that violates WeAI’s usage policies from being shown. We also encourage you to read our safety guide for more information on how to build safer systems.
