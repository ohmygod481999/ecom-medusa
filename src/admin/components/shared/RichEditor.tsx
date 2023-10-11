import EditorJS, {OutputData} from '@editorjs/editorjs';
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';

interface RichEditorProps {
  minHeight?: number;
  autofocus?: boolean;
  onChange?: (data: OutputData) => void;
}

export interface RichEditorRef {
  getEjInstance: () => EditorJS;
  getValue: () => Promise<OutputData>;
  setValue: (data: OutputData) => void;
}

const EVENT_EDITOR_READY = 'EVENT_EDITOR_READY';

export const RichEditor = forwardRef((props: RichEditorProps, ref) => {
  const ejInstance = useRef<EditorJS>();
  // const [event, _] = useState(new Event(EVENT_EDITOR_READY))

  useImperativeHandle(
    ref,
    () => {
      return {
        getEjInstance: () => ejInstance.current,
        getValue: async () => {
          return new Promise<OutputData>((res, rej) => {
            if (ejInstance.current) {
              ejInstance.current.save().then(data => {
                res(data);
              });
              return;
            }

            setTimeout(() => {
              rej('timeout');
            }, 3000);

            document.addEventListener(EVENT_EDITOR_READY, async () => {
              const data = await ejInstance.current.save();
              res(data);
            });
          });
        },
        setValue: async (data: OutputData) => {
          return new Promise<void>((res, rej) => {
            if (ejInstance.current) {
              ejInstance.current.blocks.insertMany(data.blocks);
              res();
              return;
            }

            setTimeout(() => {
              rej('timeout');
            }, 3000);

            document.addEventListener(EVENT_EDITOR_READY, async () => {
              ejInstance.current.blocks.insertMany(data.blocks);
              res();
            });
          });
        },
      };
      // return ejInstance.current
    },
    [ejInstance.current],
  );

  const initEditor = () => {
    const editor = new EditorJS({
      holder: 'editorjs',
      onReady: () => {
        ejInstance.current = editor;
        document.dispatchEvent(new Event(EVENT_EDITOR_READY));
      },
      autofocus: props.autofocus !== undefined ? props.autofocus : false,
      minHeight: 0,
      // onChange: async () => {
      //   let content = await editor.saver.save();

      //   console.log(content);
      // },
      tools: {
        // header: Header,
      },
    });
  };

  useEffect(() => {
    if (ejInstance.current === null) {
      initEditor();
    }

    return () => {
      console.log('destroy');
      ejInstance?.current?.destroy();
      ejInstance.current = null;
    };
  }, []);
  // useEffect(() => {
  //   return () => {};
  // }, [editor]);

  return (
    <>
      <div
        id="editorjs"
        className="caret-ui-fg-base bg-ui-bg-field hover:bg-ui-bg-field-hover shadow-borders-base placeholder-ui-fg-muted text-ui-fg-base transition-fg relative w-full appearance-none rounded-md outline-none focus:shadow-borders-interactive-with-active disabled:text-ui-fg-disabled disabled:!bg-ui-bg-disabled disabled:placeholder-ui-fg-disabled disabled:cursor-not-allowed aria-[invalid=true]:!shadow-borders-error invalid:!shadow-borders-error [&::--webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden txt-compact-medium px-3 py-[9px]"></div>
    </>
  );
});
