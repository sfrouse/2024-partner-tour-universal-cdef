// import assert from "node:assert";
import {
    // get_encoding,
    encoding_for_model
} from "tiktoken";


export default function tiktoken(prompt) {
    // // To get the tokeniser corresponding to a specific model in the OpenAI API:
    const enc = encoding_for_model("gpt-4o");
    // const result = new TextDecoder().decode(enc.decode(enc.encode("hello world")));
    const result = enc.encode(prompt);

    enc.free();

    return result.length;
}
