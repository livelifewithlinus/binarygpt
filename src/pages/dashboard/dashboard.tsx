import React, { useRef } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import VariableProximity from '@/components/variable-proximity';
import Text from '@/components/shared_ui/text';
import { useStore } from '@/hooks/useStore';
import { localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import OnboardTourHandler from '../tutorials/dbot-tours/onboarding-tour';
import Announcements from './announcements';
import Cards from './cards';
import InfoPanel from './info-panel';

type TMobileIconGuide = {
    handleTabChange: (active_number: number) => void;
};

const DashboardComponent = observer(({ handleTabChange }: TMobileIconGuide) => {
    const { load_modal, dashboard, client, google_drive } = useStore();
    const { dashboard_strategies } = load_modal;
    const { is_google_drive_configured } = google_drive;
    const { active_tab, active_tour } = dashboard;
    const has_dashboard_strategies = !!dashboard_strategies?.length;
    const { isDesktop, isTablet } = useDevice();
    const heading_ref = useRef<HTMLDivElement>(null);

    return (
        <React.Fragment>
            <div
                className={classNames('tab__dashboard', {
                    'tab__dashboard--tour-active': active_tour,
                })}
            >
                <div className='tab__dashboard__content'>
                    {client.is_logged_in && (
                        <Announcements is_mobile={!isDesktop} is_tablet={isTablet} handleTabChange={handleTabChange} />
                    )}
                    <div className='quick-panel'>
                        <div
                            className={classNames('tab__dashboard__header', {
                                'tab__dashboard__header--listed': isDesktop && has_dashboard_strategies,
                            })}
                        >
                            {!has_dashboard_strategies && (
                                <div ref={heading_ref} style={{ position: 'relative' }}>
                                    <Text
                                        className='title'
                                        as='h2'
                                        color='prominent'
                                        size={isDesktop ? 'sm' : 's'}
                                        lineHeight='xxl'
                                        weight='bold'
                                    >
                                        <VariableProximity
                                            label={localize('Load or build your bot')}
                                            fromFontVariationSettings="'wght' 400, 'opsz' 9"
                                            toFontVariationSettings="'wght' 1000, 'opsz' 40"
                                            containerRef={heading_ref}
                                            radius={100}
                                            falloff='linear'
                                        />
                                    </Text>
                                </div>
                            )}
                            <Text
                                as='p'
                                color='prominent'
                                lineHeight='s'
                                size={isDesktop ? 's' : 'xxs'}
                                className={classNames('subtitle', { 'subtitle__has-list': has_dashboard_strategies })}
                            >
                                {is_google_drive_configured
                                    ? localize(
                                          'Import a bot from your computer or Google Drive, build it from scratch, or start with a quick strategy.'
                                      )
                                    : localize(
                                          'Import a bot from your computer, build it from scratch, or start with a quick strategy.'
                                      )}
                            </Text>
                        </div>
                        <Cards has_dashboard_strategies={has_dashboard_strategies} is_mobile={!isDesktop} />
                    </div>
                </div>
            </div>
            <InfoPanel />
            {active_tab === 0 && <OnboardTourHandler is_mobile={!isDesktop} />}
        </React.Fragment>
    );
});

export default DashboardComponent;
