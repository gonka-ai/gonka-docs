# Chat Completions
Learn how to use WeAI's Core API endpoint to get responses from language models.

To use one of these models via the WeAI API, you’ll send a request to the Chat Completions API containing the inputs and your API key, and receive a response containing the model’s output.

You can experiment with various models in the chat playground. If you’re not sure which model to use then try `llama3.1-405` if you need high intelligence or `llama3.1.-8` if you need the fastest speed and lowest cost.

# Overview
The Chat Completions API supports text, and can output text content (including code and JSON).

It accepts inputs via the messages parameter, which is an array of message objects.

## Message roles
Each message object has a role (either `system`, `user`, or `assistant`) and content.

- The system message is optional and can be used to set the behavior of the assistant
- The user messages provide requests or comments for the assistant to respond to
- Assistant messages store previous assistant responses, but can also be written by you to give examples of desired behavior (few-shot examples)

!!! info 
    By default, there is no system message. Use system messages to give instructions to the model outside of the user context. You can set multiple system messages per conversation, the model will read and interpret messages in the order it receives them.

# Getting started
Chat models take a list of messages as input and return a model-generated message as output. Although the chat format is designed to make multi-turn conversations easy, it’s just as useful for single-turn tasks without any conversation.

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

Including conversation history is important when user instructions refer to prior messages. In the example above, the user's final question of "Where was it played?" only makes sense in the context of the prior messages about the World Series of 2020. Because the models have no memory of past requests, all relevant information must be supplied as part of the conversation history in each request. If a conversation cannot fit within the model’s token limit, it will need to be shortened in some way.
