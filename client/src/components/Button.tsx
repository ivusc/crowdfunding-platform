import React from 'react'

interface IButton{
  btnType: 'button' | 'reset' | 'submit' | undefined;
  title: string;
  styles: string;
  handleClick?: () => void;
}

const Button : React.FC<IButton> = ({ btnType, title, styles, handleClick }) => {
  return (
    <button type={btnType} className={`${styles} font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px]`} onClick={handleClick}>
      {title}
    </button> 
  )
}

export default Button