'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
const WithDateRangeFilter = (WrappedComponent) => {
    const WithDateRange = ({ enableFilter = true, title, desc, ...props }) => {
        const [startDate, setStartDate] = useState('');
        const [endDate, setEndDate] = useState('');

        const handleStartDateChange = (e) => setStartDate(e.target.value);
        const handleEndDateChange = (e) => setEndDate(e.target.value);

        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>
                        <span>{`${desc}`}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full">
                        {enableFilter && (
                            <div className="flex gap-4 mb-4">
                                <Label htmlFor="start-date">
                                    Start Date:
                                </Label>
                                <Input
                                    id="start-date"
                                    type="date"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    className="border p-2 rounded-md"
                                />
                                <Label htmlFor="end-date">
                                    End Date:
                                </Label>
                                <Input
                                    id="end-date"
                                    type="date"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    className="border p-2 rounded-md"
                                />
                            </div>
                        )}
                        <WrappedComponent {...props} startDate={startDate} endDate={endDate} />
                    </div>
                </CardContent>
            </Card>

        );
    };

    WithDateRange.displayName = `WithDateRangeFilter(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return WithDateRange;
};

export default WithDateRangeFilter;