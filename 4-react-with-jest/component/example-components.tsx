import { useState } from "react";
import TabsHeader from "./tabs-header.js";
import { TabsPanel } from "./tabs-panel.js";
import { TabTrigger } from "./tabs-trigger.js";
import { Tabs } from "./tabs.js";

export function DanishComposersTabs() {
    const [selectedTab, setSelectedTab] = useState("tab-1")
    const isSelected = (tabId: string) => selectedTab === tabId

    return (
        <Tabs>
            <h3 id="tablist-1">Danish Composers</h3>

            <TabsHeader aria-labelledby="tablist-1" className="automatic">
                <TabTrigger
                    id="tab-1"
                    type="button"
                    aria-selected={isSelected("tab-1")}
                    aria-controls="tabpanel-1"
                    tabIndex={isSelected("tab-1") ? 0 : -1}
                    onClick={() => setSelectedTab("tab-1")}
                >
                    <span className="focus">Maria Ahlefeldt</span>
                </TabTrigger>
                <TabTrigger
                    id="tab-2"
                    type="button"
                    aria-selected={isSelected("tab-2")}
                    aria-controls="tabpanel-2"
                    tabIndex={isSelected("tab-2") ? 0 : -1}
                    onClick={() => setSelectedTab("tab-2")}
                >
                    <span className="focus">Carl Andersen</span>
                </TabTrigger>
                <TabTrigger
                    id="tab-3"
                    type="button"
                    aria-selected={isSelected("tab-3")}
                    aria-controls="tabpanel-3"
                    tabIndex={isSelected("tab-3") ? 0 : -1}
                    onClick={() => setSelectedTab("tab-3")}
                >
                    <span className="focus">Ida da Fonseca</span>
                </TabTrigger>
                <TabTrigger
                    id="tab-4"
                    type="button"
                    aria-selected={isSelected("tab-4")}
                    aria-controls="tabpanel-4"
                    tabIndex={isSelected("tab-4") ? 0 : -1}
                    onClick={() => setSelectedTab("tab-4")}
                >
                    <span className="focus">Peter Müller</span>
                </TabTrigger>
            </TabsHeader>

            <TabsPanel
                id="tabpanel-1"
                tabIndex={0}
                aria-labelledby="tab-1"
                hidden={!isSelected("tab-1")}
            >
                <p>
                    Maria Theresia Ahlefeldt (16 January 1755 – 20 December 1810) was a Danish-German composer known as Denmark's first female composer.
                </p>
            </TabsPanel>
            <TabsPanel
                id="tabpanel-2"
                tabIndex={0}
                aria-labelledby="tab-2"
                hidden={!isSelected("tab-2")}
            >
                <p>
                    Carl Joachim Andersen (29 April 1847 – 7 May 1909) was a Danish flutist, conductor, and composer considered one of the finest flute virtuosos of his time.
                </p>
            </TabsPanel>
            <TabsPanel
                id="tabpanel-3"
                tabIndex={0}
                aria-labelledby="tab-3"
                hidden={!isSelected("tab-3")}
            >
                <p>
                    Ida Henriette da Fonseca (27 July 1802 – 6 July 1858) was a Danish opera singer and composer who debuted at the royal opera in 1827.
                </p>
            </TabsPanel>
            <TabsPanel
                id="tabpanel-4"
                tabIndex={0}
                aria-labelledby="tab-4"
                hidden={!isSelected("tab-4")}
            >
                <p>
                    Peter Erasmus Lange-Müller (1 December 1850 – 26 February 1926) was a Danish composer and pianist whose work was influenced by Danish folk music.
                </p>
            </TabsPanel>
        </Tabs>
    )
}
