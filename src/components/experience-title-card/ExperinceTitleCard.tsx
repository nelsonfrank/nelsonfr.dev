import React from 'react'
import { ExperinceTitleCardProps } from '.'

export interface ExperinceTitleCardProps {
    title: string
    organizationName: string
    location: string
    duration: {
        from: Date
        to: Date | string
    }
    Flag?: string
}

const getMonthYear = (date: Date) => {
    return `${date.toLocaleString('default', { month: 'long' })
        } ${date.getFullYear()}`
}

const ExperinceTitleCard = ({ title, organizationName, location, duration, Flag }: ExperinceTitleCardProps) => {

    const isPresent = typeof duration.to === 'string'
    const from = getMonthYear(duration.from)

    const to = `${typeof duration.to === 'string' ? duration.to : getMonthYear(duration.to)}`

    return (
			<div className='flex items-center mt-8'>
				<div
					className={`w-4 h-4 border-4 border-primary rounded-full mr-4 md:mr-8 ${
						isPresent ? "animate-ping" : ""
					}`}
				></div>
				<div>
					<span className='text-sm text-gray'>
						{" "}
						{from} - {to} <span className='mx-1'>&#183;</span>
						{location} {Flag && Flag}
					</span>
					<h2 className='text-xl font-semibold my-2'>{title}</h2>
					<h3 className='text-base text-gray font-medium my-2'>
						{organizationName}
					</h3>
				</div>
			</div>
		);
}

export default ExperinceTitleCard