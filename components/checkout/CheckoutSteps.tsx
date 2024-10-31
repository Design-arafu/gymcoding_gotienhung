const CheckoutSteps = ({ current = 0 }) => {
  return (
    <ul className='steps steps-vertical mt-4 w-full lg:steps-horizontal'>
      {['Đăng nhập', 'Địa chỉ giao hàng', 'Phương thức thanh toán', 'Đặt hàng'].map(
        (step, index) => (
          <li
            key={step}
            className={`step ${index <= current ? 'step-primary' : ''} `}
          >
            {step}
          </li>
        ),
      )}
    </ul>
  );
};
export default CheckoutSteps;
