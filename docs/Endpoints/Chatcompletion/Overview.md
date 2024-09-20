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