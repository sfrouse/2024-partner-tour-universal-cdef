import 'dotenv/config';
import puppeteer from 'puppeteer';
// import OpenAI from "openai";

export default async function pullHTMLComponent() {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto('https://css-tricks.com/guides/');// 'https://css-tricks.com/');
        await page.setViewport({
            width: 700,
            height: 800,
        });
        const elementId = 'post-21059';// 'post-378862';
        await page.waitForSelector(`[id=${elementId}]`);

        const compHtml = await page.evaluate(getDivHtmlAndCss, elementId);

        // const openai = new OpenAI({
        //     apiKey: process.env.OPENAI_API_KEY,
        //   });
        // const response = await openai.chat.completions.create({
        //     model: "gpt-4o",
        //     messages: [
        //         {
        //             "role": "system",
        //             "content": `You are a client side programmer for a design system.
        // You will be asked to create well formed react components that have a default export each time.
        // You provide code only, no answers, no explanations, no markdown formatting, no headers such as \`\`\`javascript.
        // You should use the convention of naming all components with a prefix of 'dsys'.
        // You should include "import React from 'react';" at the top of all results.
        // You should put all styles into a style tag withing the react component function.
        // You should always capitalzied the name of the React function.
        // You should avoid creating variables that are not initialized.
        // You should put all React elements within a Fragment element <></>.
        // You should use pixels over any other unit.`
        //         },
        //         {
        //             "role": "user",
        //             "content": `Could you create a self contained react component based off of this html
                    
        //             <style>${compHtml.css}</style>
        //             ${compHtml.html}`,
        //         }
        //     ],
        //     temperature: 0,
        //     max_tokens: 3000,
        //     top_p: 1,
        // });

        // let content = '';
        // if (response.choices && response.choices.length >= 1) {
        //     content = response.choices[0].message.content;
        // }
        // console.log('content', content);
        // await page.screenshot({ path: './example.png' });
        await browser.close();

        return compHtml;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to get HTML and CSS of a specific div by its ID
export function getDivHtmlAndCss(divId) {
    // Get the target div
    const targetDiv = document.getElementById(divId);
    if (!targetDiv) {
        console.error(`Div with id "${divId}" not found.`);
        return;
    }

    // Get the outer HTML of the target div
    const divHtml = targetDiv.outerHTML;

    // Get all CSS rules applied to the document
    let cssRules = "";
    for (let i = 0; i < document.styleSheets.length; i++) {
        const styleSheet = document.styleSheets[i];
        try {
            for (let j = 0; j < styleSheet.cssRules.length; j++) {
                const rule = styleSheet.cssRules[j];
                if (targetDiv.matches(rule.selectorText) || targetDiv.querySelector(rule.selectorText)) {
                    cssRules += rule.cssText + "\n";
                }
            }
        } catch (e) {
            // Some stylesheets (especially from external sources) may cause CORS errors
            console.warn(`Couldn't access stylesheet: ${styleSheet.href}`, e);
        }
    }

    // Output the HTML and CSS
    // console.log("HTML:");
    // console.log(divHtml);
    // console.log("CSS:");
    // console.log(cssRules);

    // Return the HTML and CSS
    return {
        html: divHtml,
        css: cssRules
    };
}

// pullHTMLComponent();