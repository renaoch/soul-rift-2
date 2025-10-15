"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { User, Mail, Phone, MapPin, Home, ArrowUpRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  zip: string;
  countryCode: string;
}

export default function CheckoutForm() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    zip: '',
    countryCode: 'IN',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error('First name is required');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Valid email is required');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      toast.error('Valid phone number is required');
      return false;
    }
    if (!formData.address1.trim()) {
      toast.error('Address is required');
      return false;
    }
    if (!formData.city.trim()) {
      toast.error('City is required');
      return false;
    }
    if (!formData.zip.trim()) {
      toast.error('PIN code is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Step 1: Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: formData,
          items: items.map(item => ({
            productId: item.productId,
            designId: item.designId,
            artistId: item.artistId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: item.price,
          })),
          totalAmount: total,
        }),
      });

      const orderResult = await orderResponse.json();

      if (!orderResult.success) {
        toast.error(orderResult.error?.message || 'Failed to create order');
        setIsProcessing(false);
        return;
      }

      // Step 2: Create Razorpay order
      const paymentResponse = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderResult.orderId,
          amount: orderResult.amount,
          currency: orderResult.currency,
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResult.success) {
        toast.error('Failed to initiate payment');
        setIsProcessing(false);
        return;
      }

      // Step 3: Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: paymentResult.amount,
        currency: paymentResult.currency,
        name: 'Soul Rift',
        description: `Order #${orderResult.orderNumber}`,
        order_id: paymentResult.razorpayOrderId,
        handler: async function (response: any) {
          setIsProcessing(true);
          
          // Verify payment
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderResult.orderId,
            }),
          });

          const verifyResult = await verifyResponse.json();

          if (verifyResult.success) {
            // Get existing emails from cookie
            const existingEmails = document.cookie
              .split('; ')
              .find(row => row.startsWith('user_emails='))
              ?.split('=')[1] || '';
            
            // Add new email if not already there
            const emailsArray = existingEmails ? existingEmails.split(',') : [];
            if (!emailsArray.includes(formData.email)) {
              emailsArray.push(formData.email);
            }
            
            // Store updated list
            document.cookie = `user_emails=${emailsArray.join(',')}; path=/; max-age=${60 * 60 * 24 * 365}`;
            
            await clearCart();
            toast.success('Payment successful!');
            router.push(`/order-confirmation/${orderResult.orderId}`);
          } else {
            toast.error('Payment verification failed');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#ff6b35',
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

      razorpay.on('payment.failed', function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong');
      setIsProcessing(false);
    }
  };

  return (
    <div 
      className="rounded-3xl backdrop-blur-3xl border p-10 shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #ff6b3508, transparent)',
        borderColor: '#ff6b3520',
      }}
    >
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-12 h-12 rounded-2xl backdrop-blur-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #ff6b3530, #ff313120)',
              boxShadow: '0 10px 40px #ff6b3530'
            }}
          >
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Shipping Details
          </h2>
        </div>
        <p className="text-gray-400 font-light">
          Where should we deliver your order?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#ff6b35]" />
            <h3 className="text-xl font-bold text-white">Contact</h3>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-3 tracking-wide">
                FIRST NAME *
              </label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#ff6b35] transition-colors" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full pl-14 pr-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
                  placeholder="John"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-3 tracking-wide">
                LAST NAME
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-3 tracking-wide">
              EMAIL *
            </label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#ff6b35] transition-colors" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-14 pr-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-3 tracking-wide">
              PHONE NUMBER *
            </label>
            <div className="relative group">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#ff6b35] transition-colors" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full pl-14 pr-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
                placeholder="9876543210"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#ff6b35]" />
            <h3 className="text-xl font-bold text-white">Delivery Address</h3>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-3 tracking-wide">
              ADDRESS LINE 1 *
            </label>
            <div className="relative group">
              <Home className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#ff6b35] transition-colors" />
              <input
                type="text"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                required
                className="w-full pl-14 pr-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
                placeholder="House No, Street Name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-3 tracking-wide">
              ADDRESS LINE 2 (OPTIONAL)
            </label>
            <input
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
              placeholder="Apartment, Suite, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-3 tracking-wide">
                CITY *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
                placeholder="Mumbai"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-3 tracking-wide">
                STATE
              </label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
                placeholder="Maharashtra"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-3 tracking-wide">
              PIN CODE *
            </label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              required
              maxLength={6}
              className="w-full px-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
              placeholder="400001"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="group relative overflow-hidden w-full py-5 rounded-2xl font-bold text-white text-lg transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ 
            background: 'linear-gradient(135deg, #ff6b35, #ff3131)',
            boxShadow: '0 20px 60px #ff6b3550'
          }}
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            {isProcessing ? 'Processing Order...' : 'Complete Order'}
            {!isProcessing && <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
          </span>
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(135deg, #ff3131, #ff6b35)',
            }}
          />
        </button>
      </form>
    </div>
  );
}
