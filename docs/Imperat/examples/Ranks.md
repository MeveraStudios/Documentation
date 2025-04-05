---
sidebar_position: 13
---
# Rank Command
:::danger[CRITICAL]
This example is pretty advanced and would require you to have some experience with Imperat and Java.
:::

Before writing our rank command, we would need to create a [POJO](https://www.codecademy.com/resources/docs/java/pojo) that would act as a template for the rank's data.
Let's create our `Rank` class:

```java
@Getter
@Setter
public final class Rank {

    private final String name;
    private final List<String> permissions = new ArrayList<>();
    private String prefix, suffix;

    public Rank(String name) {
        this.name = name;
    }

}
```

Now let's create our `manager` class that is going to manage our ranks:
```java
public final class RankManager {

    private final Map<String, Rank> ranks = new LinkedHashMap<>(); //all ranks per name here in natural order
    private final Map<UUID, Rank> perPlayerRank = new HashMap<>(); //per player rank, very simple and illustrative approach

    private final static Rank DEFAULT_RANK = new Rank("member");

    //dependency injection
    public RankManager() {
        registerRank(DEFAULT_RANK);
    }

    public @Nullable Rank getRank(String name) {
        return ranks.get(name);
    }

    public @Nullable Rank getPlayerRank(UUID playerUUID) {
        return perPlayerRank.get(playerUUID);
    }

    public void setPlayerRank(UUID playerRank, Rank rank) {
        if(!ranks.containsKey(rank.getName())) {
            return;
        }
        perPlayerRank.put(playerRank, rank);
    }

    public void registerRank(@NotNull Rank rank) {
        ranks.put(rank.getName(), rank);
    }

    public void updateRank(String name, Function<Rank, Rank> updater) {
        ranks.computeIfPresent(name,(presentRankName, presentRank)-> updater.apply(presentRank));
    }

    public void removeRank(String name) {
        ranks.remove(name);
        for(var playerId : perPlayerRank.keySet()) {
            Rank rank = getPlayerRank(playerId);
            if(rank == null) continue;
            if(rank.getName().equals(name)) {
                //remove the rank
                perPlayerRank.remove(playerId);
            }
        }
    }

    public boolean hasRank(String name) {
        return ranks.get(name) != null;
    }

    public Collection<? extends Rank> getRanks() {
        return ranks.values();
    }
}
```

We are also  going to need a parameter type for `Rank` class, let's create our `RankParameterType`:
```java
import static dev.velix.imperat.exception.SourceException.ErrorLevel.SEVERE;

public class RankParameterType extends BaseParameterType<BukkitSource, Rank> {
    private final RankManager rankManager;

    private final SuggestionResolver<BukkitSource> ranks_suggestions;
    public RankParameterType(RankManager rankManager) {
        super(TypeWrap.of(Rank.class));
        this.rankManager = rankManager;
        ranks_suggestions = (context, parameter) -> rankManager.getRanks().stream().map(Rank::getName).toList();
    }

    @Override
    public @Nullable Rank resolve(ExecutionContext<BukkitSource> context, @NotNull CommandInputStream<BukkitSource> commandInputStream) throws ImperatException {
        String input = commandInputStream.currentRaw().orElseThrow();
        Rank rank = rankManager.getRank(input.toLowerCase());
        if(rank == null) {
            throw new SourceException(SEVERE, "Invalid rank '%s'", input);
        }else {
            return rank;
        }
    }

    @Override
    public @NotNull Rank fromString(Imperat<BukkitSource> imperat, String input) {
        return Objects.requireNonNull(
                rankManager.getRank(input)
        );
    }

    @Override
    public SuggestionResolver<BukkitSource> getSuggestionResolver() {
        return ranks_suggestions;
    }
}
```

Now let's create our actual `RankCommand` class:
```java
@Command({"rank", "group"})// main-name='rank', alias "group"
@Permission("server.command.rank")
@Description("Manages ranks")
public class RankCommand {

    /*
        /rank create <rank>
        /rank delete <rank>
        /rank <rank> setprefix <prefix>
        /rank <rank> setsuffix <suffix>
        /rank <rank> addpermission <permission>
        /rank <rank> removepermission <permission>
        /rank <rank> give <player>
     */

    @Usage
    public void noArgs(BukkitSource source, CommandHelp help) {
        help.display(source);
    }

    @Usage
    public void mainUsage(BukkitSource source, @Named("rank") Rank rank, CommandHelp help) {
        help.display(source);
    }

    @SubCommand(value = "create", attachDirectly = true)
    @Permission("server.command.rank.create")
    @Description("Creates a rank")
    public static class CreateRankSub {
        @Dependency
        private RankManager rankManager;

        @Usage
        public void def(BukkitSource source, @Named("rank") Rank rank) {
            source.error("/rank create <rank-name>");
        }

        @Usage
        public void createRank(BukkitSource source, @Named("rank-name") String rankName) {
            if(rankManager.hasRank(rankName)) {
                source.error("Rank '" + rankName + "' already exists");
            }else {
                //creating new Rank
                Rank rank = new Rank(rankName.toLowerCase());
                rankManager.registerRank(rank);
                source.reply(ChatColor.GREEN + "Created rank '" + rankName + "'");
            }
        }
    }

    @SubCommand(value = "setprefix")
    @Permission("server.command.rank.setprefix")
    @Description("Sets prefix for rank")
    public static class SetPrefixSub {
        @Dependency
        private RankManager rankManager;

        @Usage
        public void def(BukkitSource source, @Named("rank") Rank rank) {
            source.error("/rank <rank> setprefix <rank-name>");
        }

        @Usage
        public void setRankPrefix(BukkitSource source, @Named("rank") Rank rank, @Named("prefix") String prefix) {
            rank.setPrefix(prefix);
            rankManager.updateRank(rank.getName(), (rankInMap)-> rank);
            source.reply(ChatColor.GREEN + "Set prefix of rank '" + rank.getName() + "' to '" + prefix +"'");
        }
    }

    @SubCommand(value = "delete", attachDirectly = true)
    @Permission("server.command.rank.delete")
    @Description("Deletes a rank")
    public static class DeleteRankSub {
        @Dependency
        private RankManager rankManager;

        @Usage
        public void def(BukkitSource source, @Named("rank") Rank rank) {
            source.error("/rank delete <rank-name>");
        }

        @Usage
        public void deleteRank(BukkitSource source, @Named("rank-name") String rankName) {
            if(!rankManager.hasRank(rankName)) {
                source.error("Rank '" + rankName + "' doesn't exist");
            } else {
                rankManager.removeRank(rankName);
                source.reply(ChatColor.GREEN + "Deleted rank '" + rankName + "'");
            }
        }
    }

    @SubCommand(value = "setsuffix")
    @Permission("server.command.rank.setsuffix")
    @Description("Sets suffix for rank")
    public static class SetSuffixSub {
        @Dependency
        private RankManager rankManager;

        @Usage
        public void def(BukkitSource source, @Named("rank") Rank rank) {
            source.error("/rank <rank> setsuffix <suffix>");
        }

        @Usage
        public void setRankSuffix(BukkitSource source, @Named("rank") Rank rank, @Named("suffix") String suffix) {
            rank.setSuffix(suffix);
            rankManager.updateRank(rank.getName(), (rankInMap)-> rank);
            source.reply(ChatColor.GREEN + "Set suffix of rank '" + rank.getName() + "' to '" + suffix +"'");
        }
    }

    @SubCommand(value = "addpermission")
    @Permission("server.command.rank.addpermission")
    @Description("Adds a permission to a rank")
    public static class AddPermissionSub {
        @Dependency
        private RankManager rankManager;

        @Usage
        public void def(BukkitSource source, @Named("rank") Rank rank) {
            source.error("/rank <rank> addpermission <permission>");
        }

        @Usage
        public void addPermission(BukkitSource source, @Named("rank") Rank rank, @Named("permission") String permission) {
            if(rank.getPermissions().contains(permission)) {
                source.error("Rank '" + rank.getName() + "' already has permission '" + permission + "'");
                return;
            }

            rank.getPermissions().add(permission);
            rankManager.updateRank(rank.getName(), (rankInMap)-> rank);
            source.reply(ChatColor.GREEN + "Added permission '" + permission + "' to rank '" + rank.getName() + "'");
        }
    }

    @SubCommand(value = "removepermission")
    @Permission("server.command.rank.removepermission")
    @Description("Removes a permission from a rank")
    public static class RemovePermissionSub {
        @Dependency
        private RankManager rankManager;

        @Usage
        public void def(BukkitSource source, @Named("rank") Rank rank) {
            source.error("/rank <rank> removepermission <permission>");
        }

        @Usage
        public void removePermission(BukkitSource source, @Named("rank") Rank rank, @Named("permission") String permission) {
            if(!rank.getPermissions().contains(permission)) {
                source.error("Rank '" + rank.getName() + "' doesn't have permission '" + permission + "'");
                return;
            }

            rank.getPermissions().remove(permission);
            rankManager.updateRank(rank.getName(), (rankInMap)-> rank);
            source.reply(ChatColor.GREEN + "Removed permission '" + permission + "' from rank '" + rank.getName() + "'");
        }
    }

    @SubCommand(value = "give")
    @Permission("server.command.rank.give")
    @Description("Gives a rank to a player")
    public static class GiveRankSub {
        @Dependency
        private RankManager rankManager;

        @Usage
        public void def(BukkitSource source, @Named("rank") Rank rank) {
            source.error("/rank <rank> give <player>");
        }

        @Usage
        public void giveRank(BukkitSource source, @Named("rank") Rank rank, @Named("player") Player player) {
            rankManager.setPlayerRank(player.getUniqueId(), rank);
            source.reply(ChatColor.GREEN + "You have assigned rank '" + rank.getName() + "' to player '" + player.getName() + "'");
        }
    }
}
```

## Main class example
Here's our main class example:
```java
public class ExamplePlugin extends JavaPlugin {
    
    private BukkitImperat imperat;
    private RankManager rankManager;

    @Override
    public void onEnable() {
        rankManager = new RankManager();

        //setting up our imperat
        imperat = BukkitImperat.builder(this)
                .dependencyResolver(RankManager.class,()-> rankManager)
                .parameterType(Rank.class, new RankParameterType(rankManager))
                .build();
        
        //registering rank command.
        imperat.registerCommand(new RankCommand());
    }
}
```