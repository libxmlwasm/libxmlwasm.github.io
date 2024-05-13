import Editor from '@monaco-editor/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useReducer, useState } from 'react';
import { db } from './lib/db';
import defaultHTML from "./sample.html?raw";
import { useLibxml } from './lib/libxml';

function App() {
  const libxml = useLibxml()
  const texts = useLiveQuery(() => db.texts.toArray(), [])
  const [html, dispatch] = useReducer(
    (_state: string, content: string) => {
      console.log('dispatch')
      if (texts?.[0]?.id === 0) {
        console.log('update')
        db.texts.update(0, { content });
      } else {
        console.log('add')
        db.texts.add({ id: 0, content });
      }
      return content
    },
    defaultHTML,
    (arg: string) => {
      console.log(texts?.[0]?.content)
      return texts?.[0]?.content || arg
    },
  )
  useEffect(() => {
    if (texts?.[0]?.content) {
      dispatch(texts[0].content)
    }
  }, [texts])

  const [xpath, setXpath] = useState("//body/h1")
  useEffect(() => {
    console.log("evaluate");
    if (libxml) {
      console.log("libxml has initialized");
      try {
        const doc = libxml.parseHTML(html)
        console.log(doc)
        const nodes = doc.getNode(xpath)
        const nodesStr = nodes.map(node => node.toString()).join("\n")
        setResult("Result :" + nodesStr)
      } catch (error) {
        setResult("Error :" + error)
      }
    }
  }, [html, libxml, xpath])

  const [result, setResult] = useState("")

  return (
    <div className="flex flex-col h-dvh">
      <div className="h-12 bg-slate-300 flex flex-col">
        <a href="https://github.com/libxmlwasm/libxml.wasm" className="text-xl font-mono my-auto ml-4">libxml.wasm</a>
      </div>
      <div className="h-full w-dvw">
        <div className="h-1/2 flex">
          <div className="w-1/2">
            <Editor
              height="100%"
              defaultLanguage="html"
              defaultValue={defaultHTML}
              onChange={val => val && dispatch(val)}
              value={html}
              className="border-b-black"
            />
          </div>
          <div className="w-1/2">
            <Editor
              height="100%"
              defaultLanguage="plaintext"
              defaultValue={xpath}
              onChange={val => val && setXpath(val)}
            />
          </div>
        </div>
        <div className="h-1/2 w-full">
          <Editor
            height="100%"
            defaultLanguage="plaintext"
            defaultValue=""
            value={result}
          />
        </div>
      </div>
    </div>
  )
}

export default App
