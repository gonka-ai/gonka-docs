# Chat Completions
Learn how to use OpenAI's Core API endpoint to get responses from language models.

## Try GPT-4o
Try out GPT-4o in the playground

## Explore GPT-4o with image inputs
Check out the vision guide for image understanding

To use one of these models via the OpenAI API, you’ll send a request to the Chat Completions API containing the inputs and your API key, and 
receive a response containing the model’s output.

You can experiment with various models in the chat playground. If you’re not sure which model to use then try `gpt-4o` if you need high 
intelligence or `gpt-4o-mini` if you need the fastest speed and lowest cost.

# Overview
The Chat Completions API supports text and image inputs, and can output text content (including code and JSON).

It accepts inputs via the `messages` parameter, which is an array of message objects.

## Message roles
Each message object has a role (either `system`, `user`, or `assistant`) and content.

- The system message is optional and can be used to set the behavior of the assistant
- The user messages provide requests or comments for the assistant to respond to
- Assistant messages store previous assistant responses, but can also be written by you to give examples of desired behavior (few-shot examples)

!!! info
    By default, there is no system message. Use system messages to give instructions to the model outside of the user context. You can set multiple system messages per conversation, the model will read and interpret messages in the order it receives them.