---
sidebar_position: 12
---
# Kill Command
We will be recreating the command `/kill <target>`, we will need to use `TargetSelector` parameter type provided by **Imperat**\
Let's create our kill command class:

```java
import studio.mevera.imperat.BukkitSource;
import studio.mevera.imperat.annotations.Command;
import studio.mevera.imperat.annotations.Description;
import studio.mevera.imperat.annotations.Named;
import studio.mevera.imperat.annotations.Permission;
import studio.mevera.imperat.annotations.Usage;
import studio.mevera.imperat.selector.TargetSelector;
import org.bukkit.ChatColor;
import org.bukkit.entity.Entity;
import org.bukkit.entity.LivingEntity;

@Command("kill")
@Permission("command.kill")
@Description("Kills entities")
public class KillCommand {

    @Usage
    public void def(BukkitSource source) {
        source.error("/kill <target>");
    }

    @Usage
    public void kill(BukkitSource source, @Named("target") TargetSelector selector) {
        int count = 0;
        for(Entity entity : selector) {
            if(entity instanceof LivingEntity livingEntity) {
                livingEntity.setHealth(0D);
            }

            entity.remove();
            count++;
        }
        source.reply(ChatColor.YELLOW + "Killed " + count + " entities");
    }
}
```
