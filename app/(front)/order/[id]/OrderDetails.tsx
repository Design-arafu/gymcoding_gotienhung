'use client';

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { OrderItem } from '@/lib/models/OrderModel';

interface IOrderDetails {
  orderId: string;
  paypalClientId: string;
}

const OrderDetails = ({ orderId, paypalClientId }: IOrderDetails) => {
  const { data: session } = useSession();

  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      res.ok
        ? toast.success('Order delivered successfully')
        : toast.error(data.message);
    },
  );

  const { trigger: paidOrder, isMutating : isPaiding } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`/api/admin/orders/${orderId}/paid`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const data = await res.json()
      res.ok
       ? toast.success('Đã thanh toán thành công')
       : toast.error(data.message)
    }
  )

  const { data, error } = useSWR(`/api/orders/${orderId}`);

  if (error) return error.message;
  if (!data) return 'Loading...';

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
  } = data;

  return (
    <div>
      <h1 className='py-4 text-2xl'>Đơn hàng: {orderId}</h1>
      <div className='my-4 grid md:grid-cols-4 md:gap-5'>
        <div className='md:col-span-3'>
          <div className='card bg-base-300'>
            <div className='card-body'>
              <h2 className='card-title'>Địa chỉ giao hàng</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.phone}, {shippingAddress.country}{' '}
              </p>
              {isDelivered ? (
                <div className='text-success'>Giao lúc {deliveredAt}</div>
              ) : (
                <div className='text-error'>Chưa giao hàng</div>
              )}
            </div>
          </div>

          <div className='card mt-4 bg-base-300'>
            <div className='card-body'>
              <h2 className='card-title'>Phương thức thanh toán</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <div className='text-success'>Thanh toán lúc {paidAt}</div>
              ) : session?.user?.isAdmin ? (
                <div className='text-error'>Chưa thanh toán</div>
              ) : (
                <>
                 <div className="flex items-center justify-center my-4">
                    <div className="border-b border-gray-400 w-full"></div>
                 </div>
                <div>
                    <div className='mb-2 flex justify-start'>
                      <div>Người nhận: Dương Đăng Hưng</div>
                    </div>
                    <div className='mb-2 flex'>
                      <div>Số điện thoại/ Zalo: 0907.210.127</div>
                    </div>
                </div>

                <div className='border-2 border-indigo-200 rounded'>Cám ơn bạn đã đặt hàng. Chúng tôi sẽ kiểm tra đơn hàng và sớm liên hệ lại với bạn.</div>
                </>
                )}
            </div>
          </div>

          <div className='card mt-4 bg-base-300'>
            <div className='card-body'>
              <h2 className='card-title'>Danh sách sản phẩm</h2>
              <table className='table'>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: OrderItem) => (
                    <tr key={item.slug}>
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className='flex items-center'
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          <span className='px-2'>
                            {item.name} ({item.color} {item.size})
                          </span>
                        </Link>
                      </td>
                      <td>{item.qty}</td>
                      <td>${item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className='card bg-base-300'>
            <div className='card-body'>
              <h2 className='card-title'>Tổng đơn hàng</h2>
              <ul>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Sản phẩm</div>
                    <div>{itemsPrice} VND</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Tổng cộng</div>
                    <div>{totalPrice} VND</div>
                  </div>
                </li>

                {session?.user.isAdmin && (
                  <>
                    <li>
                      <button
                        className='btn my-2 w-full'
                        onClick={() => paidOrder()}
                        disabled={isPaiding}
                      >
                        {isPaiding && (
                          <span className='loading loading-spinner'></span>
                        )}
                        Đã thanh toán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn my-2 w-full'
                        onClick={() => deliverOrder()}
                        disabled={isDelivering}
                      >
                        {isDelivering && (
                          <span className='loading loading-spinner'></span>
                        )}
                        Đã giao hàng
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
