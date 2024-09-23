---
sidebar_position: 10
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Platforms
Imperat is a generic command dispatching framework, It can work almost on every platform possible if implemented properly.
so to depend on any of the platforms you must first declare our repoistory in your build tool configuration file as follows:
<Tabs>
    <TabItem value="maven" label="Maven pom.xml" default>
       Maven central (default)
    </TabItem>

    <TabItem value="gradle" label="Gradle build.gradle">
        ```
            repositories {
                mavenCentral();
            }
        ```
    </TabItem>
</Tabs>

In order to add the dependency of any platform, you should first add the dependency of the core module, then add the 
platform's dependency as below:
<Tabs>
    <TabItem value="maven" label="Maven" default> 
    
    ```xml 
    <dependency>
        <groupId>dev.velix</groupId>
            <artifactId>imperat-PLATFORM</artifactId>
        <version>VERSION</version>
    </dependency>
    ```
    </TabItem>

    <TabItem value="gradle" label="Gradle (short)">
        `implementation "dev.velix:imperat-PLATFORM:VERSION"`
    </TabItem>
</Tabs>

Platforms are classified into:
- **Minecraft Platforms**
- **Non-Minecraft Platforms**

## Minecraft platforms
Imperat currently has implementations for the current minecraft-related platforms:
- Bukkit
- Bungeecord

:::tip[Pro Tip]
You can use and integrate Imperat with Mojang's Brigadier
you can do the following after initializing Imperat and BEFORE registering any commands.
```java
imperat.applyBrigadier();
```

:::

### Bukkit
The `BukkitImperat` is the impl for Imperat on bukkit platform.
The command source in bukkit is called `BukkitSource`.

All resolvers have a middle interface that starts the prefix `Bukkit`,
for example: `BukkitValueResolver`, `BukkitContextResolver`, `BukkitSuggestionResolver`
You are free to make use of them.

### Bungee
SAME AS BUKKIT but the prefix is `Bungee`


## Other platforms
### CLI
**CLI** for command-line applications, The `CommandLineImperat` is the impl for Imperat on CLI platform.
the command source in CLI is called `ConsoleSource`.

### Others
coming soon...

