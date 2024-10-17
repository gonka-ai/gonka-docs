# Chat Completions
Discover how to utilize the Core API endpoint from WeAI to obtain outputs from language models.

To access an LLM through the WeAI API, submit a request to the Chat Completions API, including your inputs and API key. The API will respond with the model’s generated output.

You can test different models using the chat playground. If you’re unsure which model to choose, start with `llama3.1-70B` for advanced capabilities or `llama3.1-8B` for optimal speed and cost efficiency.

## Overview
The Chat Completions API is designed to handle text and can generate text-based outputs, including code and JSON. It takes inputs through the messages parameter, which consists of an array of message objects.

### Message roles
Each message object includes a role (system, user, or assistant) and corresponding content.

- The system message is optional and can define the assistant’s behavior.
- User messages contain the requests or inputs for the assistant to respond to.
- Assistant messages log past responses from the assistant, but you can also craft them to provide examples of expected behavior (few-shot examples).

!!! info
By default, no system message is present. Use system messages to give instructions to the model that are separate from user inputs. You can set multiple system messages within a conversation, and the model processes them sequentially as they are received.

## Getting started
Chat models accept a list of messages as input and produce a model-generated message as output. While the chat format is optimized for multi-turn interactions, it is equally effective for single-turn tasks without ongoing dialogue.

An example Chat Completions API call looks like the following:

=== "node.js"
    ```
    import WeAI from "weai";

    const weai = new WeAI();

    async function main() {
    const completion = await weai.chat.completions.create({
        messages: [{"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Who won the world series in 2020?"},
            {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
            {"role": "user", "content": "Where was it played?"}],
        model: "llama3.1-8B",
    });

    console.log(completion.choices[0]);
    }
    main();
    ```

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

To learn more, you can view the full API reference documentation for the Chat API.

Including the conversation history is crucial when user instructions reference earlier messages. In the example above, the user’s final question, “Where was it played?” relies on the context established by the previous messages about the 2020 World Series. Since the models do not retain memory of past interactions, all relevant details must be provided as part of the conversation history in each request. If the entire conversation exceeds the model’s token limit, it will need to be condensed accordingly.

## Response format

An example Chat Completions API response looks as follows:

```bash
{
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "The 2020 World Series was played in Texas at Globe Life Field in Arlington.",
        "role": "assistant"
      },
      "logprobs": null
    }
  ],
  "created": 1677664795,
  "id": "chatcmpl-7QyqpwdfhqwajicIEznoc6Q47XAyW",
  "model": "llama3.1-8B",
  "object": "chat.completion",
  "usage": {
    "completion_tokens": 17,
    "prompt_tokens": 57,
    "total_tokens": 74
  }
}
```

The assistant's reply can be extracted with:

=== "curl"
    ```
    message = completion.choices[0].message.content
    ```

=== "python"
    ```
    message = completion.choices[0].message.content
    ```

=== "node.js"
    ```
    message = completion.choices[0].message.content
    ```

Every response will include a `finish_reason`. The possible values for `finish_reason` are:

- `stop`: API returned complete message, or a message terminated by one of the stop sequences provided via the stop parameter
- `length`: Incomplete model output due to `max_tokens` parameter or token limit
- `function_call`: The model decided to call a function
- `content_filter`: Omitted content due to a flag from our content filters
- `null`: API response still in progress or incomplete

Depending on input parameters, the model response may include different information.
