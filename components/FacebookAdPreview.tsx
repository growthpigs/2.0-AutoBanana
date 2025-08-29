import React from 'react';
import { FacebookAdContent } from '../types';

interface FacebookAdPreviewProps {
    content: FacebookAdContent;
    onTextChange: (newContent: Partial<FacebookAdContent>) => void;
}

const AutoGrowTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
    const ref = React.useRef<HTMLTextAreaElement>(null);

    React.useLayoutEffect(() => {
        const el = ref.current;
        if (el) {
            el.style.height = 'inherit';
            el.style.height = `${el.scrollHeight}px`;
        }
    }, [props.value]);

    return <textarea ref={ref} {...props} />;
};


export const FacebookAdPreview: React.FC<FacebookAdPreviewProps> = ({ content, onTextChange }) => {
    return (
        <div className="w-full max-w-lg mx-auto bg-white rounded-lg overflow-hidden h-full flex flex-col">
            <img 
                src={content.imageUrl} 
                alt="Facebook ad creative" 
                className="w-full object-cover"
            />
            <div className="p-4 flex-grow flex flex-col bg-gray-50">
                <div className="text-xs text-gray-500 mb-2 uppercase font-semibold">yoursite.com</div>
                <input
                    type="text"
                    value={content.headline}
                    onChange={(e) => onTextChange({ headline: e.target.value })}
                    className="text-lg font-bold text-gray-900 mb-2 w-full bg-transparent border-none focus:ring-0 p-0"
                    placeholder="Editable headline..."
                />
                <AutoGrowTextarea
                    value={content.bodyText}
                    onChange={(e) => onTextChange({ bodyText: e.target.value })}
                    className="text-sm text-gray-700 w-full bg-transparent border-none focus:ring-0 p-0 resize-none overflow-hidden"
                    placeholder="Editable body text..."
                    rows={1}
                />
            </div>
            <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
                <button className="w-full text-center py-2 px-4 rounded-md bg-blue-600 text-white font-bold text-sm">
                    Learn More
                </button>
            </div>
        </div>
    );
};