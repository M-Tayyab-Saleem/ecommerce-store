import React from 'react'

interface TitleProps {
  text1: string;
  text2: string;
}

const Title: React.FC<TitleProps> = ({ text1, text2 }) => {
  return (
    <div className='flex flex-col items-center justify-center mb-10 space-y-2'>
        <p className='text-sm text-accent uppercase tracking-[0.2em] font-bold'>
            {text1}
        </p> 
        <h2 className='text-4xl md:text-5xl font-heading font-bold text-primary relative inline-block'>
            {text2}
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-[2px] bg-accent/50 rounded-full"></span>
        </h2>
    </div>
  )
}

export default Title