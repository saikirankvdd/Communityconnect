import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  KeyRound, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { authApi } from '../../api/authApi';
import { communityApi } from '../../api/communityApi';

export const AdminInvitationActivation = ({ onActivationSuccess, onNavigate }) => {
  const [token, setToken] = useState('cc-token-greenglen-44321');
  const [invitationDetails, setInvitationDetails] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      const inv = authApi.getInvitationByToken(token);
      setInvitationDetails(inv);
    }
  }, [token]);

  const handleVerifyToken = () => {
    const inv = authApi.getInvitationByToken(token);
    if (!inv) {
      setError('Invitation token not found or already consumed. Please check with Platform Operations.');
      setInvitationDetails(null);
    } else {
      setError('');
      setInvitationDetails(inv);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setIsActivating(true);

    try {
      const result = await authApi.activateInvitation(token, newPassword, invitationDetails?.recipientName);
      setIsSuccess(true);
      setTimeout(() => {
        onActivationSuccess(result.user);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Activation failed.');
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#FAF8F5] py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 to-purple-600 p-6 text-white text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mx-auto flex items-center justify-center mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-display">Society Admin Activation</h2>
          <p className="text-xs text-purple-100 mt-1">
            Activate your cryptographic invitation &amp; establish permanent credentials
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 font-display">Account Activated!</h3>
              <p className="text-xs text-gray-600">
                Permanent credentials established. Redirecting you to the Society Admin Dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Token Input with Sample Helper */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Invitation Token
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="cc-token-xxxx-xxxx"
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleVerifyToken}
                    className="px-3 py-2 bg-purple-100 text-purple-800 hover:bg-purple-200 rounded-xl text-xs font-bold transition"
                  >
                    Verify
                  </button>
                </div>
              </div>

              {/* Verified Invitation Details Card */}
              {invitationDetails && (
                <div className="p-3.5 bg-purple-50/70 rounded-2xl border border-purple-200 text-xs space-y-1.5 animate-in fade-in">
                  <div className="flex justify-between">
                    <span className="text-purple-700">Community:</span>
                    <strong className="text-gray-900">{invitationDetails.communityName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Designated Admin:</span>
                    <strong className="text-gray-900">{invitationDetails.recipientName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Authorized Email:</span>
                    <strong className="text-gray-900">{invitationDetails.recipientEmail}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Invitation Status:</span>
                    <span className="font-bold text-emerald-700">{invitationDetails.status}</span>
                  </div>
                </div>
              )}

              {/* Set Permanent Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Set Permanent Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Confirm Permanent Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isActivating || !invitationDetails}
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isActivating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Activate Account &amp; Proceed to Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-gray-600 hover:text-gray-900 font-semibold"
            >
              Return to Common Login
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
