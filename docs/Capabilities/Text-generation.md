# Text generation models
Text generation models, commonly known as generative pre-trained transformers or large language models, are trained to interpret natural language and code. These models generate text outputs based on the inputs they receive, often referred to as “prompts.” Crafting a prompt is essentially the process of “programming” a language model, typically by giving instructions or examples that demonstrate how to complete a task successfully.

Using open-source text generation models, you can build applications to:

- Draft documents
- Write computer code
- Answer questions about a knowledge base
- Analyze texts
- Give software a natural language interface
- Tutor in a range of subjects
- Translate languages
- Simulate characters for games

To access a model through the WeAI API, you send a request to the Chat Completions API with your inputs and API key, and you’ll receive a response with the model’s output.

You can test different models in the chat playground.

## Quickstart
Chat models take a list of messages as input and return a model-generated message as output. Although the chat format is designed to make multi-turn conversations easy, it's just as useful for single-turn tasks without any conversation.

An example Chat Completions API call looks like the following:

=== "python"
    ```
    from weai import WeAI
    client = WeAI()

    response = client.chat.completions.create(
    model="llama3.1-8B",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who won the world series in 2020?"},
        {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
        {"role": "user", "content": "Where was it played?"}
    ]
    )
    ```

=== "curl"
    ```
    curl https://weai.productscience.ai/v1/chat/completions \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $WEAI_API_KEY" \
        -d '{
            "model": "llama3.1-8B",
            "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": "Who won the world series in 2020?"
            },
            {
                "role": "assistant",
                "content": "The Los Angeles Dodgers won the World Series in 2020."
            },
            {
                "role": "user",
                "content": "Where was it played?"
            }
            ]
        }'
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
    model: "llama3.1-8B",
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
We generally recommend that you default to using either `llama3.1-8B`.

If your use case requires high intelligence or reasoning about images as well as text, we recommend you evaluate `llama3.1-70B`.

If your use case requires the fastest speed and lowest cost, we recommend `llama3.1-8B` since it is optimized for these aspects.

You can experiment in the playground to investigate which models provide the best price performance trade-off for your usage. A common design pattern is to use several distinct query types which are each dispatched to the model appropriate to handle them.

### How should I set the temperature parameter?
You can think of temperature like randomness, with 0 being least random (or most deterministic) and 2 being most random (least deterministic). 
When using low values for temperature (e.g. 0.2) the model responses will tend to be more consistent but may feel more robotic. Values higher than 1.0, especially values close to 2.0, can lead to erratic model outputs. If your goal is creative outputs, a combination of a slightly higher than normal temperature (e.g. 1.2) combined with a prompt specifically asking the model to be creative may be your best bet, but we encourage experimentation.

### Is fine-tuning available for the latest models?
See the fine-tuning guide for the latest information on which models are available for fine-tuning and how to get started.

### How can I make my application more safe?
If you want to add a moderation layer to the outputs of the Chat API, you can follow our moderation guide to prevent content that violates WeAI’s usage policies from being shown. We also encourage you to read our safety guide for more information on how to build safer systems.
