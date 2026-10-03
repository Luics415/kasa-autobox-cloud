'use client';

import React, { useState } from 'react';
import { 
  Key, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  Terminal, 
  FileCode, 
  ExternalLink 
} from 'lucide-react';
import { EphemeralSandbox } from '@/types/sandbox';

interface CredentialsDrawerProps {
  sandbox: EphemeralSandbox | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CredentialsDrawer({ sandbox, isOpen, onClose }: CredentialsDrawerProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'env' | 'bash' | 'cli'>('env');

  if (!isOpen || !sandbox) return null;

  const { credentials } = sandbox;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const bashExportSnippet = `export AWS_ACCESS_KEY_ID="${credentials.accessKeyId}"
export AWS_SECRET_ACCESS_KEY="${credentials.secretAccessKey}"
export AWS_SESSION_TOKEN="${credentials.sessionToken}"
export AWS_DEFAULT_REGION="us-east-1"
# Sandbox endpoint
export KASA_SERVICE_URL="${sandbox.endpointUrl}"`;

  const envFileSnippet = `AWS_ACCESS_KEY_ID=${credentials.accessKeyId}
AWS_SECRET_ACCESS_KEY=${credentials.secretAccessKey}
AWS_SESSION_TOKEN=${credentials.sessionToken}
AWS_DEFAULT_REGION=us-east-1
KASA_SERVICE_URL=${sandbox.endpointUrl}`;

  const awsCliSnippet = `aws configure set aws_access_key_id "${credentials.accessKeyId}" --profile kasa-${sandbox.id}
aws configure set aws_secret_access_key "${credentials.secretAccessKey}" --profile kasa-${sandbox.id}
aws configure set aws_session_token "${credentials.sessionToken}" --profile kasa-${sandbox.id}
aws configure set region "us-east-1" --profile kasa-${sandbox.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ground/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-surface-raised border border-surface-border rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface-inset/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-nominal/10 border border-nominal/20 text-nominal">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                Temporary AWS STS Credentials
                <span className="text-xs px-2 py-0.5 rounded bg-surface-border text-slate-400 font-mono">
                  {sandbox.id}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Scoped IAM role credentials for testing integration against this ephemeral environment.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-surface-border text-slate-400 hover:text-slate-200 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Status banner */}
          <div className="flex items-start gap-3 p-3.5 rounded bg-surface-inset border border-surface-border">
            <ShieldCheck className="w-5 h-5 text-nominal shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Role ARN:</span>
                <span className="font-mono text-slate-400 text-[11px] truncate max-w-xs">{credentials.scopedRoleArn}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Expires At:</span>
                <span className="font-mono text-amber-400 text-[11px]">{new Date(credentials.expiration).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Individual Key Cards */}
          <div className="space-y-3">
            {/* Access Key ID */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">AWS_ACCESS_KEY_ID</label>
              <div className="flex items-center gap-2 bg-surface-inset border border-surface-border rounded p-2">
                <code className="text-xs font-mono text-slate-200 flex-1 truncate select-all">
                  {credentials.accessKeyId}
                </code>
                <button
                  onClick={() => copyToClipboard(credentials.accessKeyId, 'accessKeyId')}
                  className="p-1.5 rounded bg-surface-raised hover:bg-surface-hover text-slate-300 hover:text-white transition-colors"
                  title="Copy Access Key"
                >
                  {copiedKey === 'accessKeyId' ? <Check className="w-4 h-4 text-nominal" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Secret Access Key */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">AWS_SECRET_ACCESS_KEY</label>
              <div className="flex items-center gap-2 bg-surface-inset border border-surface-border rounded p-2">
                <code className="text-xs font-mono text-slate-200 flex-1 truncate select-all">
                  {credentials.secretAccessKey}
                </code>
                <button
                  onClick={() => copyToClipboard(credentials.secretAccessKey, 'secretKey')}
                  className="p-1.5 rounded bg-surface-raised hover:bg-surface-hover text-slate-300 hover:text-white transition-colors"
                  title="Copy Secret Key"
                >
                  {copiedKey === 'secretKey' ? <Check className="w-4 h-4 text-nominal" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Session Token */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">AWS_SESSION_TOKEN</label>
              <div className="flex items-center gap-2 bg-surface-inset border border-surface-border rounded p-2">
                <code className="text-xs font-mono text-slate-400 flex-1 truncate select-all">
                  {credentials.sessionToken}
                </code>
                <button
                  onClick={() => copyToClipboard(credentials.sessionToken, 'sessionToken')}
                  className="p-1.5 rounded bg-surface-raised hover:bg-surface-hover text-slate-300 hover:text-white transition-colors"
                  title="Copy Session Token"
                >
                  {copiedKey === 'sessionToken' ? <Check className="w-4 h-4 text-nominal" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Snippets Tabs */}
          <div className="space-y-2 pt-2 border-t border-surface-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Quick Integration Snippets</span>
              <div className="flex items-center gap-1 bg-surface-inset p-1 rounded border border-surface-border">
                <button
                  onClick={() => setActiveTab('env')}
                  className={`text-xs px-2.5 py-1 rounded font-mono transition-colors ${
                    activeTab === 'env' ? 'bg-surface-border text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  .env
                </button>
                <button
                  onClick={() => setActiveTab('bash')}
                  className={`text-xs px-2.5 py-1 rounded font-mono transition-colors ${
                    activeTab === 'bash' ? 'bg-surface-border text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  bash export
                </button>
                <button
                  onClick={() => setActiveTab('cli')}
                  className={`text-xs px-2.5 py-1 rounded font-mono transition-colors ${
                    activeTab === 'cli' ? 'bg-surface-border text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  aws cli
                </button>
              </div>
            </div>

            <div className="relative bg-surface-inset border border-surface-border rounded p-3">
              <pre className="text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre">
                {activeTab === 'env' && envFileSnippet}
                {activeTab === 'bash' && bashExportSnippet}
                {activeTab === 'cli' && awsCliSnippet}
              </pre>
              <button
                onClick={() => {
                  const content = 
                    activeTab === 'env' ? envFileSnippet :
                    activeTab === 'bash' ? bashExportSnippet : awsCliSnippet;
                  copyToClipboard(content, 'snippet');
                }}
                className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-1 rounded bg-surface-raised hover:bg-surface-hover border border-surface-border text-xs text-slate-300 transition-colors"
              >
                {copiedKey === 'snippet' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-nominal" />
                    <span className="text-nominal">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-surface-border bg-surface-inset/60">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            <span>Credentials automatically revoke upon sandbox teardown.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium bg-surface-border hover:bg-surface-border-strong text-white rounded transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
