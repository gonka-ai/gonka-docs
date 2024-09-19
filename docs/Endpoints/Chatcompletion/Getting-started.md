# Getting started
Chat models take a list of messages as input and return a model-generated message as output. Although the chat format is designed to make 
multi-turn conversations easy, it’s just as useful for single-turn tasks without any conversation.

An example Chat Completions API call looks like the following:

=== "curl"
    ```node title="place/holder"
    import Name_Placeholder from "Name_Placeholder";
    const Name_Placeholder = new Name_Placeholder();
    const completion = await Name_Placeholder.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {"role": "user", "content": "write a haiku about ai"}
    ]
    });
    ```

=== "node.js"
    ```node title="place/holder"
    import Name_Placeholder from "Name_Placeholder";
    const Name_Placeholder = new Name_Placeholder();
    const completion = await Name_Placeholder.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {"role": "user", "content": "write a haiku about ai"}
    ]
    });
    ```

=== "python"
    ```python title="place/holder"
    import Name_Placeholder from "Name_Placeholder";
    const Name_Placeholder = new Name_Placeholder();
    const completion = await Name_Placeholder.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {"role": "user", "content": "write a haiku about ai"}
    ]
    });
    ```


To learn more, you can view the full API reference documentation for the Chat API.

Including conversation history is important when user instructions refer to prior messages. In the example above, the user's final question of 
"Where was it played?" only makes sense in the context of the prior messages about the World Series of 2020. Because the models have no memory 
of past requests, all relevant information must be supplied as part of the conversation history in each request. If a conversation cannot fit 
within the model’s token limit, it will need to be shortened in some way.

!!! info
    To mimic the effect seen in ChatGPT where the text is returned iteratively, set the stream parameter to true.