import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/lib/priceFormatter';

interface PaymentButtonProps {
  amount: number;
  reference: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  items: any[];
  onPaymentSuccess?: (transactionId: string, orderId: number) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    KkiaPay?: any;
  }
}

export function PaymentButton({
  amount,
  reference,
  email,
  phone,
  firstName,
  lastName,
  items,
  onPaymentSuccess,
  disabled = false,
}: PaymentButtonProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [kkiapayReady, setKkiapayReady] = useState(false);
  const scriptLoadedRef = React.useRef(false);

  // Load Kkiapay SDK only once
  useEffect(() => {
    if (scriptLoadedRef.current) {
      setKkiapayReady(!!window.KkiaPay);
      return;
    }

    const loadKkiapay = () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://cdn.kkiapay.com/k.js';
        script.async = true;
        
        script.onload = () => {
          scriptLoadedRef.current = true;
          setKkiapayReady(true);
        };
        
        script.onerror = () => {
          console.warn('Kkiapay SDK not available, using mock mode for development');
          // Create a mock Kkiapay for development/offline mode
          if (!window.KkiaPay) {
            window.KkiaPay = {
              show: (config: any) => {
                setTimeout(() => {
                  // Simulate successful payment for testing
                  config.callback({
                    status: 'SUCCESS',
                    transactionId: 'MOCK-' + Date.now(),
                    reference: config.reference || reference, // Use the actual reference from props
                  });
                }, 1000);
              },
            };
          }
          scriptLoadedRef.current = true;
          setKkiapayReady(true);
        };
        
        document.head.appendChild(script);
      } catch (error) {
        console.error('Failed to load Kkiapay SDK:', error);
        // Fallback to mock
        if (!window.KkiaPay) {
          window.KkiaPay = {
            show: (config: any) => {
              setTimeout(() => {
                config.callback({
                  status: 'SUCCESS',
                  transactionId: 'MOCK-' + Date.now(),
                  reference: config.reference || reference, // Use the actual reference from props
                });
              }, 1000);
            },
          };
        }
        scriptLoadedRef.current = true;
        setKkiapayReady(true);
      }
    };

    loadKkiapay();
  }, []); // Run only once on mount

  const handlePayment = async () => {
    if (!window.KkiaPay) {
      toast.error('Module de paiement non disponible');
      return;
    }

    setLoading(true);

    try {
      // Open Kkiapay payment widget
      window.KkiaPay.show({
        amount: Math.round(amount * 100), // Amount in cents
        phone,
        email,
        name: `${firstName} ${lastName}`,
        description: `ShineCraft - ${items.length} article(s)`,
        key: import.meta.env.VITE_KKIAPAY_PUBLIC_KEY,
        position: 'CENTER',
        callback: async (response: any) => {
          try {
            // Payment was successful on the client side
            // Now verify with backend
            console.log('Payment callback response:', response);

            if (response && response.status === 'SUCCESS') {
              // Verify payment with backend
              const verifyResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/api/payments/verify`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  },
                  body: JSON.stringify({
                    reference,
                    transactionId: response.transactionId,
                  }),
                }
              );

              if (!verifyResponse.ok) {
                throw new Error('Payment verification failed');
              }

              const verifyData = await verifyResponse.json();

              if (verifyData.success) {
                toast.success('Paiement validé avec succès !');

                // Store complete order and payment data in sessionStorage for confirmation page
                if (verifyData.order) {
                  sessionStorage.setItem('orderData', JSON.stringify(verifyData.order));
                }
                if (verifyData.payment) {
                  sessionStorage.setItem('paymentData', JSON.stringify(verifyData.payment));
                }
                sessionStorage.setItem('orderId', verifyData.orderId);
                sessionStorage.setItem('transactionId', verifyData.transactionId);

                if (onPaymentSuccess) {
                  onPaymentSuccess(verifyData.transactionId, verifyData.orderId);
                } else {
                  // Redirect to order success page
                  navigate('/order-success');
                }
              } else {
                toast.error('La vérification du paiement a échoué');
              }
            } else if (response && response.status === 'PENDING') {
              // Payment is pending verification
              toast.info('Le paiement est en cours de vérification...');
              // Check status after a few seconds
              setTimeout(() => {
                checkPaymentStatus(reference);
              }, 3000);
            } else {
              toast.error('Le paiement a été annulé ou a échoué');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Erreur lors de la vérification du paiement');
          } finally {
            setLoading(false);
          }
        },
        onError: (error: any) => {
          console.error('Kkiapay error:', error);
          toast.error('Erreur lors du paiement: ' + (error?.message || 'Erreur inconnue'));
          setLoading(false);
        },
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Erreur lors du paiement');
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (ref: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payments/status/${ref}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.status === 'paid') {
        toast.success('Paiement confirmé !');
        sessionStorage.setItem('orderId', data.orderId);
        navigate('/order-success');
      } else if (data.status === 'pending') {
        // Still pending, check again
        setTimeout(() => {
          checkPaymentStatus(ref);
        }, 3000);
      } else {
        toast.error('Le paiement n\'a pas été complété');
      }
    } catch (error) {
      console.error('Status check error:', error);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || loading || !kkiapayReady}
      size="lg"
      className="w-full"
    >
      {loading ? (
        <>
          <span className="mr-2">Traitement...</span>
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
        </>
      ) : !kkiapayReady ? (
        'Chargement du module de paiement...'
      ) : (
        `Payer ${formatPrice(amount)}`
      )}
    </Button>
  );
}

export default PaymentButton;
