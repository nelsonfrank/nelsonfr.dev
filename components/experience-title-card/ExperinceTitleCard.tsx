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
      <div className="nf-flex nf-items-center nf-mt-4">
        <div
          className={`nf-w-4 nf-h-4 nf-border-4 nf-border-primary nf-rounded-full nf-mr-4 md:nf-mr-8 ${
            isPresent ? "nf-animate-ping" : ""
          }`}
        ></div>
        <div>
          <span className="nf-text-sm nf-text-gray">
            {" "}
            {from} - {to} <span className="nf-mx-1">&#183;</span>
            {location} {Flag && Flag}
          </span>
          <h2 className="nf-text-xl nf-font-semibold">{title}</h2>
          <h3 className="nf-text-base nf-text-gray nf-font-medium">
            {organizationName}
          </h3>
        </div>
      </div>
    );
}

export default ExperinceTitleCard