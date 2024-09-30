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
