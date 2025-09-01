import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Code, Copy, Eye, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ArtifactViewerProps {
  html: string;
  title: string;
  onClose: () => void;
  onCustomize?: () => void;
}

export function ArtifactViewer({ html, title, onClose, onCustomize }: ArtifactViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false);

  useEffect(() => {
    if (iframeRef.current && html) {
      const iframe = iframeRef.current;
      
      // Create a complete HTML document with TailwindCSS
      const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: white;
            }
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>
          ${html}
        </body>
        </html>
      `;
      
      // Write the HTML to the iframe
      iframe.srcdoc = fullHtml;
    }
  }, [html, title]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-1/2 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Code className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        <div className="flex items-center space-x-2">
          {onCustomize && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomizeDialog(true)}
              className="text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200"
            >
              <Edit className="w-4 h-4 mr-1" />
              Customize
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCode(!showCode)}
            className="text-gray-500 hover:text-gray-700"
          >
            {showCode ? <Eye className="w-4 h-4" /> : <Code className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="text-gray-500 hover:text-gray-700"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {showCode ? (
          <div className="h-full overflow-auto p-4">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
              <code>{html}</code>
            </pre>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            title={title}
          />
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Live interactive artifact</span>
          {copied && <span className="text-green-600">Copied to clipboard!</span>}
        </div>
      </div>

      {/* Customize Dialog */}
      <Dialog open={showCustomizeDialog} onOpenChange={setShowCustomizeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="w-5 h-5" />
              <span>Customize Artifact</span>
            </DialogTitle>
            <DialogDescription>
              Take this Artifact with you in a new chat with TheoAssist and evolve it with your own unique theological perspective.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Customizing an Artifact requires starting a new conversation where you can modify and enhance this biblical tool with TheoAssist's guidance.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomizeDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                setShowCustomizeDialog(false);
                onCustomize?.();
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              Customize this Artifact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}